export enum ProxyEvent {
  //### INTERNAL #####################################################################################################//

  $JOINED = "$$joined",
  $LEFT = "$$left",
  $DATA = "$$data",

  $ADD_ROOM = "$$add-room",
  $REMOVE_ROOM = "$$remove-room",
  $ROOM_DATA = "$$room-data",

  //### CLIENT #######################################################################################################//

  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",

  LOAD_ROOM = "load-room",

  ADD_HUMAN = "add-human",
  REMOVE_HUMAN = "remove-human",
  MOVE_HUMAN = "move-human",

  TEST = "test",

  POINTER_TILE = "pointer-tile",

  MESSAGE = "message",
}
