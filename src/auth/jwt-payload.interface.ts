export interface JwtPayload {
  id: string;
  email: string;
  role?: {
    name: string;
  };
}
