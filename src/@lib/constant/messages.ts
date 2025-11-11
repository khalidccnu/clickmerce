import { Env } from '.environments';

export const Messages = {
  login: (wt?: string) => `Welcome to ${wt || Env.webTitle}!`,
  register: 'Successfully registered. Please login!',
  wrong: 'Something went wrong!',
  create: 'Successfully created!',
  update: 'Successfully updated!',
  delete: 'Successfully deleted!',
};
