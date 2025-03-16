import { Point2d } from "./point.types";

export type ModalData = {
  dragPolygon: number[];
  closeCircle: {
    position: Point2d;
    radius: number;
  };
};

export type ModalProps = {
  setModalData: (data: ModalData) => void;
  onClose?: () => void;
};
