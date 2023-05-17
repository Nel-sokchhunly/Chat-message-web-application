export type LoginForm = {
  email: string;
  password: string;
};

export type SignupForm = {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
};

// auth form
export enum FormState {
  login = 'login',
  signup = 'signup'
}
