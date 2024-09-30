import { NavigatorCategory } from "shared/enums";

export const NAVIGATOR_CATEGORY_SPRITE_MAP: Record<NavigatorCategory, string> =
  {
    [NavigatorCategory.PUBLIC]: "icon-public",
    [NavigatorCategory.PRIVATE]: "icon-private",
    [NavigatorCategory.TOP]: "icon-top",
    [NavigatorCategory.LIKED]: "icon-liked",
    [NavigatorCategory.OWN]: "icon-own",
  };
