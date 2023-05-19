export type LoginForm = {
  email: string;
  password: string;
};

export type SignupForm = {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
  emailVisibility: boolean;
};

// auth form
export enum FormState {
  login = 'login',
  signup = 'signup'
}

export type UserInfo = {
  id: string;
  email: string;
  direct_chat: any[];
  group_chat: any[];
  username: string;
};
