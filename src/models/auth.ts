export interface RegisterModel {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}
