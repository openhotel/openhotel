export enum Event {
  WELCOME = "welcome",

  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",

  LOAD_ROOM = "load-room",
  REMOVE_ROOM = "remove-room",

  ADD_HUMAN = "add-human",
  REMOVE_HUMAN = "remove-human",
  MOVE_HUMAN = "move-human",

  POINTER_TILE = "pointer-tile",

  MESSAGE = "message",
  TYPING_START = "typing-start",
  TYPING_END = "typing-end",

  TEST = "test",

  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}
