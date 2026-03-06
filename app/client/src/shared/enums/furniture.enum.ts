export enum FurnitureType {
  FURNITURE,
  FRAME,
}

export enum FurnitureAction {
  // rotates between textures
  INTERACTIVE,
  // has a 1/0 value on interaction // 0 > closed // 1 > open
  DOOR,
  // returns a consumable from the furniture
  INVENTORY,
  // sits player on furnis
  SIT,
  // lies player down furnis
  LIE_FLAT,
  // searches for teleport function
  TELEPORT,
  // returns a random number between x-y
  DICE,
}

export enum FurnitureProps {
  // you want walk on top
  WALK,
  // it can only be placed on floor
  FLOOR,
  // cannot have furnis on top
  NO_TOP,
}

export enum FurnitureInteraction {
  ANYONE,
  ANYONE_NEAR,
  ONLY_OWNER,
}
