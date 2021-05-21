import jsonwebtoken from 'jwt-decode';

export const decodeToken = (
  token: string = ''
): { [key: string]: any } | null => jsonwebtoken(token);
