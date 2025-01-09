
export const publicRoutes = [
    "/landing","/auth/new-verification",'/api/hooks/catch','/landing/privacy-policy','/landing/terms'
]

export const authRoutes =[
    "/auth/login","/auth/register","/auth/error","/auth/forgot-password","/auth/reset-password",'/api/auth/callback/notion',"api/auth/login"
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/home"

export const settingsRoutes = [
    "/api/settings","/api/connections","api/callback"
]

export const protectedRoutes = [
    "/"
]