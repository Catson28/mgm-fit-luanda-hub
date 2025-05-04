import { PrismaClient, LogType, LogLevel, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Interface for JWT payload
interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  roles?: Array<{
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
      type: string;
      resource: string;
    }>
  }>;
  exp?: number;
  iat?: number;
}

export interface LogOptions {
  type: LogType;
  level: LogLevel;
  message: string;
  details?: string;
  source?: string;
  ip?: string;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Prisma.JsonValue;
  tags?: string[];
}

interface NextApiResponse extends Response {
  statusCode: number;
  on(event: string, callback: () => void): void;
}

class Logger {
  /**
   * Log an event to database
   */
  async log(options: LogOptions): Promise<void> {
    try {
      await prisma.log.create({
        data: {
          type: options.type,
          level: options.level,
          message: options.message,
          details: options.details,
          source: options.source,
          ip: options.ip,
          userId: options.userId,
          resourceId: options.resourceId,
          resourceType: options.resourceType,
          metadata: options.metadata as Prisma.InputJsonValue,
          tags: options.tags || [],
        },
      });
    } catch (error) {
      console.error('Failed to create log entry:', error);
      console.log({
        type: 'SYSTEM',
        level: 'ERROR',
        message: 'Failed to create log entry',
        details: JSON.stringify(options),
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Log system related events
   */
  async system(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.SYSTEM,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log application related events
   */
  async application(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.APPLICATION,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log web server related events
   */
  async webServer(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.WEB_SERVER,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log security related events
   */
  async security(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.SECURITY,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log database related events
   */
  async database(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.DATABASE,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log network related events
   */
  async network(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.NETWORK,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log audit events (user actions)
   */
  async audit(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.AUDIT,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log performance related events
   */
  async performance(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.PERFORMANCE,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log transaction events
   */
  async transaction(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message'>>): Promise<void> {
    return this.log({
      type: LogType.TRANSACTION,
      level: options?.level || LogLevel.INFO,
      message,
      ...options,
    });
  }

  /**
   * Log debug information
   */
  async debug(message: string, options?: Partial<Omit<LogOptions, 'type' | 'message' | 'level'>>): Promise<void> {
    return this.log({
      type: LogType.DEBUG,
      level: LogLevel.DEBUG,
      message,
      ...options,
    });
  }

  /**
   * Create middleware to log HTTP requests
   */
  requestMiddleware() {
    return async (req: Request, res: NextApiResponse, next: () => void) => {
      const start = Date.now();
      const url = req.url;
      const method = req.method;
      const forwardedFor = req.headers.get('x-forwarded-for');
      const ip = forwardedFor || 'unknown';

      res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;

        this.webServer(`${method} ${url} ${status}`, {
          level: status >= 400 ? LogLevel.ERROR : LogLevel.INFO,
          details: `Response time: ${duration}ms`,
          ip: typeof ip === 'string' ? ip : (ip as string).split(',')[0],
          metadata: {
            duration,
            status,
            method,
            url
          } as Prisma.JsonValue,
          tags: [`status-${status}`, `method-${method}`]
        });
      });

      next();
    };
  }
}

// Function to extract user info from JWT token
const getUserFromToken = (req: NextRequest): { userId?: string; userEmail?: string } => {
  try {
    const token = req.cookies.get('accessToken')?.value;
    if (!token) return {};

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not defined");
      return {};
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return {
      userId: decoded.id,
      userEmail: decoded.email
    };
  } catch (error) {
    console.error("Error extracting user from token:", error);
    return {};
  }
};

// Create and export singleton instance
export const logger = new Logger();

// Helper to create middleware for API routes
export const withLogging = (handler: (req: NextRequest, context: unknown) => Promise<NextResponse>) => {
  return async (req: NextRequest, context: unknown) => {
    const start = Date.now();
    const url = req.url;
    const method = req.method;
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      const { userId } = getUserFromToken(req);

      await logger.webServer(`${method} ${url}`, {
        level: LogLevel.INFO,
        ip: typeof ip === 'string' ? ip : 'unknown',
        userId,
        metadata: {
          method,
          url,
        } as Prisma.JsonValue,
        tags: [`method-${method}`]
      });

      const response = await handler(req, context);

      const duration = Date.now() - start;
      await logger.webServer(`${method} ${url} ${response.status}`, {
        level: response.status >= 400 ? LogLevel.ERROR : LogLevel.INFO,
        details: `Response time: ${duration}ms`,
        ip: typeof ip === 'string' ? ip : 'unknown',
        userId,
        metadata: {
          duration,
          status: response.status,
        } as Prisma.JsonValue,
        tags: [`status-${response.status}`, `method-${method}`]
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logger.webServer(`${method} ${url} Error`, {
        level: LogLevel.ERROR,
        details: errorMessage,
        ip: typeof ip === 'string' ? ip : 'unknown',
        metadata: {
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
        } as Prisma.JsonValue,
        tags: [`error`, `method-${method}`]
      });

      throw error;
    }
  };
};

export default logger;