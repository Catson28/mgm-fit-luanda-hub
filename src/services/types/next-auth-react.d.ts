declare module 'next-auth/react' {
  export * from 'next-auth/react/types'

  interface SignInOptions {
    email?: string
    password?: string
    code?: string
    redirect?: boolean
    callbackUrl?: string
  }

  interface SignInResponse {
    error?: string | null
    status?: number
    ok?: boolean
    url?: string
  }

  export function signIn(provider?: string, options?: SignInOptions): Promise<SignInResponse>
  export function signOut(options?: { callbackUrl?: string, redirect?: boolean }): Promise<void>
} 