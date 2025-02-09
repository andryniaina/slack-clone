export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
}

export interface UserStatus {
  isOnline: boolean;
  lastSeen?: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
} 