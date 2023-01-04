export interface TokenPayload {
    exp: number;
    username: string;
    email: string;
    phone: string;
    Role: string;
    userId: number;
    jti?: string;
  }
  declare global {
    namespace Express {
      interface Request {
        payload: TokenPayload;
      }
    }
  }
  