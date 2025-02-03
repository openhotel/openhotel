import { SignalIconComponent } from "./signal-icon.component";

export default {
  title: "Components/Icons/Signal",
  component: SignalIconComponent,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Signal = {
  args: {
    ms: 10,
  },
};
