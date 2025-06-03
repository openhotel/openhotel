export enum ProxyEvent {
  //### INTERNAL #####################################################################################################//

  $LOAD = "$$load",

  $USER_JOINED = "$$user-joined",
  $USER_LEFT = "$$user-left",
  $USER_DATA = "$$user-data",
  $USER_API_DATA = "$$user-api-data",

  $ADD_ROOM = "$$add-room",
  $REMOVE_ROOM = "$$remove-room",
  $ROOM_DATA = "$$room-data",

  $DISCONNECT_USER = "$$disconnect-user",

  $UPDATE = "$$update",
  $STOP = "$$stop",

  //### CLIENT #######################################################################################################//

  WELCOME = "welcome",

  PRE_JOIN_ROOM = "pre-join-room",
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  DELETE_ROOM = "delete-room",

  LOAD_ROOM = "load-room",
  REMOVE_ROOM = "remove-room",

  ADD_HUMAN = "add-human",
  REMOVE_HUMAN = "remove-human",
  MOVE_HUMAN = "move-human",
  SET_POSITION_HUMAN = "set-position-human",

  ADD_FURNITURE = "add-furniture",
  UPDATE_FURNITURE = "update-furniture",
  REMOVE_FURNITURE = "remove-furniture",
  INTERACT_FURNITURE = "interact-furniture",

  POINTER_TILE = "pointer-tile",
  POINTER_INTERACTIVE = "pointer-interactive",

  PLACE_ITEM = "place-item",
  ROTATE_FURNITURE = "rotate-furniture",
  PICK_UP_FURNITURE = "pick-up-furniture",
  MOVE_FURNITURE = "move-furniture",

  MESSAGE = "message",
  WHISPER_MESSAGE = "whisper-messsage",
  TYPING_START = "typing-start",
  TYPING_END = "typing-end",

  SYSTEM_MESSAGE = "system-message",

  REDIRECT = "redirect",
  DISABLE_CAMERA_MOVEMENT = "disable-camera-movement",
}

export enum OnetEvent {
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  DISCONNECTED = "disconnected",
  WELCOME = "welcome",
}
