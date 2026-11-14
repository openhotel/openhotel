import { TooltipComponent } from "./tooltip.component";
import { OfficialIconComponent } from "../../components/icons";

export default {
  title: "Components/Tooltip",
  component: TooltipComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
};

export const Primary = {
  args: {
    children: (
      <div>
        <OfficialIconComponent />
        test
      </div>
    ),
    title: <div>test tooltip</div>,
  },
};
