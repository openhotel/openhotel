import { CardComponent } from "./card.component";
import { BoxComponent } from "../../components";

export default {
  title: "Components/Card",
  component: CardComponent,
};

export const Primary = {
  args: {
    children: (
      <BoxComponent fz="1.6em" fw="bold" p="2rem">
        Test
      </BoxComponent>
    ),
  },
};

export const Secondary = {
  args: {
    children: <BoxComponent p="2rem">Test</BoxComponent>,
    topSection: "top",
    bottomSection: "bottom",
    m: 20,
  },
};
