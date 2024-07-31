import { PreviewAction, PreviewTypes } from "../types";

const HUMAN_ACTIONS: PreviewAction[] = [
  {
    name: "+ Friend",
    icon: null,
    action: () => console.log("+ Friend"),
  },
  {
    name: "Dance",
    icon: null,
    action: () => console.log("Dance"),
  },
];

const FURNITURE_ACTIONS: PreviewAction[] = [
  {
    name: "Move",
    icon: null,
    action: () => console.log("move"),
  },
  {
    name: "Rotate",
    icon: null,
    action: () => console.log("Rotate"),
  },
  {
    name: "Pick up",
    icon: null,
    action: () => console.log("Pick up"),
  },
  {
    name: "Use",
    icon: null,
    action: () => console.log("Use"),
  },
];

export const PREVIEW_ACTIONS: Record<PreviewTypes, PreviewAction[]> = {
  furniture: FURNITURE_ACTIONS,
  human: HUMAN_ACTIONS,
};
