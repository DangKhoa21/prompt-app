export interface User {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
