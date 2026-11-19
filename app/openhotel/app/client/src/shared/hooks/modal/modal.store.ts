import { create } from "zustand";
import { Modal } from "shared/enums";
import { Point } from "@shared/types/point.types.ts";

type ModalType = {
  visible: boolean;
  position: Point;
  data?: unknown;
};

export const useModalStore = create<{
  modals: Record<Modal, ModalType>;
  get: (modal: Modal) => ModalType;
  getData: <T>(modal: Modal) => T | undefined;
  isOpen: (modal: Modal) => boolean;
  setPosition: (modal: Modal, position: Point) => void;
  open: (modal: Modal, position?: Point, data?: unknown) => void;
  close: (modal: Modal) => void;
  closeAll: () => void;
}>((set, get) => ({
  modals: {} as any,
  get: (modal: Modal) => get().modals[modal],
  getData: <T>(modal: Modal) => get().modals[modal]?.data as T | undefined,
  isOpen: (modal: Modal) => Boolean(get().get(modal)?.visible),
  setPosition: (modal: Modal, position: Point) =>
    set((store) => ({
      ...store,
      modals: {
        ...store.modals,
        [modal]: {
          ...store.modals[modal],
          position,
        },
      },
    })),
  open: (modal: Modal, position?: Point, data?: unknown) =>
    set((store) => ({
      ...store,
      modals: {
        ...store.modals,
        [modal]: {
          ...(store.modals[modal] ?? {}),
          visible: true,
          position: store.modals[modal]?.position ?? position ?? { x: 0, y: 0 },
          data,
        },
      },
    })),
  close: (modal: Modal) =>
    set((store) => ({
      ...store,
      modals: {
        ...store.modals,
        [modal]: {
          ...store.modals[modal],
          visible: false,
          data: undefined,
        },
      },
    })),
  closeAll: () =>
    //@ts-ignore
    set((store) => ({
      ...store,
      modals: Object.keys(store.modals).reduce(
        (modals, modal) => ({
          ...modals,
          [modal]: {
            ...store.modals[modal],
            visible: false,
            data: undefined,
          },
        }),
        {},
      ),
    })),
}));
