import { useContext } from "react";
import { RouterContext, RouterState } from "./router.context";

export const useRouter = (): RouterState => useContext(RouterContext);
