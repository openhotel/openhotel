export enum ProxyEvent {
  //### INTERNAL USER #####################################################################################################//

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

  //### INTERNAL GAME #####################################################################################################//

  $GAME_USER_REQUEST = "$$game-user-request",
  $GAME_USER_JOIN = "$$game-user-join",
  $GAME_USER_READY = "$$game-user-ready",
  $GAME_USER_DATA = "$$game-user-data",
  $GAME_USER_LEFT = "$$game-user-left",
  $GAME_USER_DISCONNECT = "$$game-user-disconnect",

  //### CLIENT #######################################################################################################//

  WELCOME = "welcome",

  PRE_JOIN_ROOM = "pre-join-room",
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  DELETE_ROOM = "delete-room",

  LOAD_ROOM = "load-room",
  REMOVE_ROOM = "remove-room",

  LOAD_GAME = "load-game",
  REMOVE_GAME = "remove-game",
  CLOSE_GAME = "close-game",

  ADD_HUMAN = "add-human",
  REMOVE_HUMAN = "remove-human",
  MOVE_HUMAN = "move-human",
  SET_POSITION_HUMAN = "set-position-human",

  ADD_FURNITURE = "add-furniture",
  UPDATE_FURNITURE = "update-furniture",
  REMOVE_FURNITURE = "remove-furniture",
  ACTION_FURNITURE = "action-furniture",

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

  UPDATE_INVENTORY = "update-inventory",
  UPDATE_CATALOG_PRICE = "update-catalog-price",
}

export enum OnetEvent {
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  DISCONNECTED = "disconnected",
  WELCOME = "welcome",
}
