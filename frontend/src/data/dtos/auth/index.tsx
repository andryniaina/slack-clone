export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
