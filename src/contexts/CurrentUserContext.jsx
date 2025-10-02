import { createContext } from "react";
// Export context after provider to satisfy Fast Refresh

const CurrentUserContext = createContext(null);
export default CurrentUserContext;
