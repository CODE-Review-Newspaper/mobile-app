import { createContext } from "react";

interface UserContextType {
}
// @ts-ignore
const UserContext = createContext<UserContextType>();
export default UserContext