export enum Event {
  WELCOME = "welcome",

  SET_LANGUAGE = "set-language",

  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",

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

  MESSAGE = "message",
  TYPING_START = "typing-start",
  TYPING_END = "typing-end",

  SYSTEM_MESSAGE = "system-message",

  TEST = "test",

  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}
