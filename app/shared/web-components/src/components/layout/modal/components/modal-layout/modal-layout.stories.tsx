import { ModalLayoutComponent } from "./modal-layout.component";
import { ModalComponent } from "../../modal.component";

export default {
  title: "Components/Layout/Modal/Layout",
  component: ModalLayoutComponent,
};

export const Primary = {
  args: {
    children: <ModalComponent>test</ModalComponent>,
  },
};
