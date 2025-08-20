import { Env } from '.environments';

export const Messages = {
  signIn: (wt?: string) => `Welcome to ${wt || Env.webTitle}!`,
  signUp: 'Successfully registered. Please Sign In!',
  wrong: 'Something went wrong!',
  create: 'Successfully created!',
  update: 'Successfully updated!',
  delete: 'Successfully deleted!',
};
