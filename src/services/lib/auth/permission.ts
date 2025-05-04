// lib/auth/permission.ts
import { db } from "@/services/lib/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

type Permission = {
  id: string;
  name: string;
  type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
  resource: string;
};

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type User = {
  id: string;
  email: string;
  name: string;
  roles: Role[];
};

interface AuthOptions {
  requiredPermissions?: string[];
  allowedRoles?: string[];
  resource?: string;
  requireAll?: boolean;
}

export function withAuth(
  handler: (req: NextRequest, user: User) => Promise<NextResponse>,
  options: AuthOptions = {},
  alternativeHandler?: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Get token from request
      const token = await getToken({ req });

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // Get user with roles and permissions
      const user = await db.user.findUnique({
        where: { id: token.sub },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Format user data
      const formattedUser: User = {
        id: user.id,
        email: user.email!,
        name: user.name!,
        roles: user.roles.map(ur => ({
          id: ur.role.id,
          name: ur.role.name,
          permissions: ur.role.permissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            type: rp.permission.type,
            resource: rp.permission.resource
          }))
        }))
      };

      // Check for NGAPA role
      const hasNGAPARole = formattedUser.roles.some(role => role.name === 'NGAPA');
      if (hasNGAPARole) {
        return handler(req, formattedUser);
      }

      const { allowedRoles = [], requiredPermissions = [], resource, requireAll = false } = options;

      // Check roles
      const hasAllowedRole = allowedRoles.length === 0 || formattedUser.roles.some(
        role => allowedRoles.includes(role.name)
      );

      // Check permissions
      const hasRequiredPermissions = checkPermissions(
        formattedUser,
        requiredPermissions,
        resource,
        requireAll
      );

      if (!hasAllowedRole || !hasRequiredPermissions) {
        if (alternativeHandler) {
          return alternativeHandler(req, formattedUser);
        }
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      return handler(req, formattedUser);
    } catch (error) {
      console.error("[AUTH_ERROR]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

function checkPermissions(
  user: User,
  requiredPermissions: string[],
  resource?: string,
  requireAll = false
): boolean {
  if (requiredPermissions.length === 0) return true;

  const userPermissions = user.roles.flatMap(role =>
    role.permissions.map(permission => ({
      name: permission.name,
      resource: permission.resource
    }))
  );

  // Check for MANAGE permission
  const hasManagePermission = userPermissions.some(
    permission =>
      permission.name === 'MANAGE' &&
      (!resource || permission.resource === resource)
  );

  if (hasManagePermission) return true;

  return requireAll
    ? requiredPermissions.every(permission =>
      userPermissions.some(p =>
        p.name === permission &&
        (!resource || p.resource === resource)
      )
    )
    : requiredPermissions.some(permission =>
      userPermissions.some(p =>
        p.name === permission &&
        (!resource || p.resource === resource)
      )
    );
}