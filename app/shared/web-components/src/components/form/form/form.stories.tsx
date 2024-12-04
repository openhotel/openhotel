import { fn } from "@storybook/test";
import { FormComponent } from "./form.component";
import { InputComponent, SelectorComponent, ButtonComponent } from "../index";
import { BoxComponent, CardComponent } from "../../../components";

export default {
  title: "Components/Form",
  component: FormComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onSubmit: fn(), onError: fn() },
};

export const Primary = {
  args: {
    m: "auto",
    w: "40rem",
    validations: {
      username: ({ value, addError }) => {
        if (!value?.length) addError("Username cannot be empty");
        if (value.length < 0) addError("Username is too short");
        if (value.length > 4) addError("Username is too long");
      },
      password: ({ value, addError, data }) => {
        if (!value?.length) addError("Password cannot be empty");
        if (value.length < 0) addError("Password is too short");
        if (value.length > 4) addError("Password is too long");
        if (value !== data.rePassword) addError("Passwords doesn't match");
      },
      country: ({ value, addError, data }) => {
        if (!value?.length) addError("Country cannot be empty");
      },
      __custom: ({ addError }) => {
        addError("Captcha not valid!");
      },
    },
    children: (
      <>
        <h1>Register</h1>
        <InputComponent name="username" placeholder="username" />
        <InputComponent
          name="password"
          type="password"
          placeholder="password"
        />
        <InputComponent
          name="rePassword"
          type="password"
          placeholder="repeat password"
        />
        <SelectorComponent
          name="country"
          placeholder="country"
          options={[
            { key: "es", value: "Spain" },
            { key: "pt", value: "Portugal" },
          ]}
        />
        <ButtonComponent>Submit</ButtonComponent>
      </>
    ),
  },
};

export const CodeForm = {
  args: {
    m: "auto",
    children: (
      <CardComponent topSection="Submit code" w="30rem">
        <BoxComponent p="2.5rem">
          <InputComponent name="code" placeholder="code" mb="md" />
          <ButtonComponent fullWidth>Submit</ButtonComponent>
        </BoxComponent>
      </CardComponent>
    ),
  },
};
