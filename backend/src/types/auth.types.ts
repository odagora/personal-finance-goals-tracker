export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
