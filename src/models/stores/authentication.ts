export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  token: string;
  role: string;
}

export interface AuthState {
  userProfile: User;
  setUserProfile: (profile: User) => void;
  clearUserProfile: () => void;
}
