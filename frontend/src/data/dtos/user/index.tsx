export interface User {
  _id: string;
  email: string;
  username?: string;
  isOnline: boolean;
  avatar?: string;
  bio?: string;
}
