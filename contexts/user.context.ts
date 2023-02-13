import { createContext } from 'react';

import { GoogleUser } from '../googleClient/google.types';

export interface UserContextType {
  user: GoogleUser | null;
  isSignedIn: boolean;
  signIn: () => unknown;
  signOut: () => unknown;
  about: {
    isCodeMember: boolean;
  };
}
// @ts-ignore
const UserContext = createContext<UserContextType>();
export default UserContext;
