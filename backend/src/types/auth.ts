export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthRequest extends Express.Request {
  user?: AuthUser;
}
