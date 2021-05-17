import jwt from "jwt-decode";

export const decodeToken = (token: string = ""): string | { [key: string]: any; } | null => {
    return jwt(token)
}