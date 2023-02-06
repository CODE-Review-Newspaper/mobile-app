import { createContext } from "react";
import { User } from "../types/dings.types";

export interface UserContextType {
    user: User | null
    isSignedIn: boolean
    signIn: () => unknown
    signOut: () => unknown
}
// @ts-ignore
const UserContext = createContext<UserContextType>();
export default UserContext