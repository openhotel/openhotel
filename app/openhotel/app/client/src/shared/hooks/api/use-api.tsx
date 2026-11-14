import { useContext } from "react";
import { ApiContext, ApiState } from "shared/hooks/api/api.context";

export const useApi = (): ApiState => useContext(ApiContext);
