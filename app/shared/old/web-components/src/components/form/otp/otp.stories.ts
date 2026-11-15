import { fn } from "@storybook/test";
import { OtpComponent } from "./otp.component";

export default {
  title: "Components/Form/OTP Input",
  component: OtpComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onChange: fn() },
};

export const Primary = {
  args: {
    placeholder: "2FA",
    name: "otp",
  },
};
