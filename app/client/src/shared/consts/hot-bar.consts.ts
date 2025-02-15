import { Env, global } from "@tu/tulip";

export const HOT_BAR_HEIGHT = 32 + global.envs.get(Env.SAFE_AREA_INSET_BOTTOM);
