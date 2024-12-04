import * as React from "react";
import { ButtonComponent, InputComponent, SelectorComponent } from "../form";

const ColorBox: React.FC<{
  c: string;
  bg: string;
  bd?: string;
  text?: string;
}> = ({ c, bg, bd, text }) => (
  <div
    style={{
      background: bg,
      color: c,
      border: `0.2rem solid ${bd ?? "transparent"}`,
      borderRadius: "var(--border-radius)",
      minHeight: "150px",
      minWidth: "150px",
      padding: "2rem",
      margin: "1rem",
    }}
  >
    <div style={{ fontWeight: "bold", paddingBottom: "3rem" }}>
      {text ?? "Sample text"}
    </div>

    <div>{bg.replace(/var\(|\)/g, "")}</div>
    <div>{c.replace(/var\(|\)/g, "")}</div>
  </div>
);

const PaletteComponent: React.FC<undefined> = () => {
  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      <h2>Contrast</h2>
      <section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
            background: "var(--text-0-bg)",
          }}
        >
          <ColorBox c="var(--text-0-c)" bg="var(--text-0-bg)" text="Text 0" />
          <ColorBox c="var(--text-1-c)" bg="var(--text-1-bg)" text="Text 1" />
          <ColorBox c="var(--text-2-c)" bg="var(--text-2-bg)" text="Text 2" />
          <ColorBox c="var(--text-3-c)" bg="var(--text-3-bg)" text="Text 3" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
            background: "var(--text-1-bg)",
          }}
        >
          <ColorBox c="var(--text-0-c)" bg="var(--text-0-bg)" text="Text 0" />
          <ColorBox c="var(--text-1-c)" bg="var(--text-1-bg)" text="Text 1" />
          <ColorBox c="var(--text-2-c)" bg="var(--text-2-bg)" text="Text 2" />
          <ColorBox c="var(--text-3-c)" bg="var(--text-3-bg)" text="Text 3" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
            background: "var(--text-2-bg)",
          }}
        >
          <ColorBox c="var(--text-0-c)" bg="var(--text-0-bg)" text="Text 0" />
          <ColorBox c="var(--text-1-c)" bg="var(--text-1-bg)" text="Text 1" />
          <ColorBox c="var(--text-2-c)" bg="var(--text-2-bg)" text="Text 2" />
          <ColorBox c="var(--text-3-c)" bg="var(--text-3-bg)" text="Text 3" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
            background: "var(--text-3-bg)",
          }}
        >
          <ColorBox c="var(--text-0-c)" bg="var(--text-0-bg)" text="Text 0" />
          <ColorBox c="var(--text-1-c)" bg="var(--text-1-bg)" text="Text 1" />
          <ColorBox c="var(--text-2-c)" bg="var(--text-2-bg)" text="Text 2" />
          <ColorBox c="var(--text-3-c)" bg="var(--text-3-bg)" text="Text 3" />
        </div>
      </section>

      <h2>Colors</h2>
      <section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-dark-0)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-1)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-2)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-3)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-4)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-5)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-6)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-7)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-8)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-dark-9)" c="var(--color-light-1)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-light-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-2)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-3)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-4)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-5)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-6)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-7)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-8)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-light-9)" c="var(--color-dark-9)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-grey-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-2)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-3)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-4)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-5)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-grey-6)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-grey-7)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-grey-8)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-grey-9)" c="var(--color-light-1)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-blue-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-blue-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-blue-2)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-blue-3)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-blue-4)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-blue-5)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-blue-6)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-blue-7)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-blue-8)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-blue-9)" c="var(--color-light-1)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-red-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-2)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-3)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-4)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-5)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-red-6)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-red-7)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-red-8)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-red-9)" c="var(--color-light-1)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-yellow-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-2)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-3)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-4)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-5)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-6)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-7)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-8)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-yellow-9)" c="var(--color-dark-9)" />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          <ColorBox bg="var(--color-purple-0)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-purple-1)" c="var(--color-dark-9)" />
          <ColorBox bg="var(--color-purple-2)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-3)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-4)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-5)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-6)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-7)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-8)" c="var(--color-light-1)" />
          <ColorBox bg="var(--color-purple-9)" c="var(--color-light-1)" />
        </div>
      </section>

      <h2>Buttons</h2>
      <section style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <ButtonComponent variant="plain" color="blue">
          Plain blue
        </ButtonComponent>

        <ButtonComponent variant="plain" color="yellow">
          Plain yellow
        </ButtonComponent>

        <ButtonComponent variant="plain" color="grey">
          Plain grey
        </ButtonComponent>

        <ButtonComponent variant="plain" color="dark">
          Plain dark
        </ButtonComponent>

        <ButtonComponent variant="plain" color="light">
          Plain light
        </ButtonComponent>
      </section>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <ButtonComponent variant="3d" color="blue">
          3D blue
        </ButtonComponent>

        <ButtonComponent variant="3d" color="yellow">
          3D yellow
        </ButtonComponent>

        <ButtonComponent variant="3d" color="grey">
          3D grey
        </ButtonComponent>

        <ButtonComponent variant="3d" color="dark">
          3D dark
        </ButtonComponent>

        <ButtonComponent variant="3d" color="light">
          3D light
        </ButtonComponent>
      </section>

      <h2>Button colors</h2>
      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <ColorBox
          bg="var(--btn-blue-bg)"
          c="var(--btn-blue-c)"
          bd="var(--btn-blue-bd)"
          text="btn-blue"
        />
        <ColorBox
          bg="var(--btn-blue-hover-bg)"
          c="var(--btn-blue-hover-c)"
          bd="var(--btn-blue-hover-bd)"
          text="btn-blue-hover"
        />
        <ColorBox
          bg="var(--btn-blue-focus-bg)"
          c="var(--btn-blue-focus-c)"
          bd="var(--btn-blue-focus-bd)"
          text="btn-blue-focus"
        />

        <ColorBox
          bg="var(--btn-yellow-bg)"
          c="var(--btn-yellow-c)"
          bd="var(--btn-yellow-bd)"
          text="btn-yellow"
        />
        <ColorBox
          bg="var(--btn-yellow-hover-bg)"
          c="var(--btn-yellow-hover-c)"
          bd="var(--btn-yellow-hover-bd)"
          text="btn-yellow-hover"
        />
        <ColorBox
          bg="var(--btn-yellow-focus-bg)"
          c="var(--btn-yellow-focus-c)"
          bd="var(--btn-yellow-focus-bd)"
          text="btn-yellow-focus"
        />

        <ColorBox
          bg="var(--btn-grey-bg)"
          c="var(--btn-grey-c)"
          bd="var(--btn-grey-bd)"
          text="btn-grey"
        />
        <ColorBox
          bg="var(--btn-grey-hover-bg)"
          c="var(--btn-grey-hover-c)"
          bd="var(--btn-grey-hover-bd)"
          text="btn-grey-hover"
        />
        <ColorBox
          bg="var(--btn-grey-focus-bg)"
          c="var(--btn-grey-focus-c)"
          bd="var(--btn-grey-focus-bd)"
          text="btn-grey-focus"
        />

        <ColorBox
          bg="var(--btn-dark-bg)"
          c="var(--btn-dark-c)"
          bd="var(--btn-dark-bd)"
          text="btn-dark"
        />
        <ColorBox
          bg="var(--btn-dark-hover-bg)"
          c="var(--btn-dark-hover-c)"
          bd="var(--btn-dark-hover-bd)"
          text="btn-dark-hover"
        />
        <ColorBox
          bg="var(--btn-dark-focus-bg)"
          c="var(--btn-dark-focus-c)"
          bd="var(--btn-dark-focus-bd)"
          text="btn-dark-focus"
        />

        <ColorBox
          bg="var(--btn-light-bg)"
          c="var(--btn-light-c)"
          bd="var(--btn-light-bd)"
          text="btn-light"
        />
        <ColorBox
          bg="var(--btn-light-hover-bg)"
          c="var(--btn-light-hover-c)"
          bd="var(--btn-light-hover-bd)"
          text="btn-light-hover"
        />
        <ColorBox
          bg="var(--btn-light-focus-bg)"
          c="var(--btn-light-focus-c)"
          bd="var(--btn-light-focus-bd)"
          text="btn-light-focus"
        />
      </section>

      <h2>Input</h2>
      <section
        style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}
      >
        <InputComponent placeholder="Placeholder" mb="md" maw={300} />
        <InputComponent value="Value" mb="md" maw={300} />
        <InputComponent
          placeholder="Placeholder"
          value="Value"
          mb="md"
          maw={300}
        />
      </section>

      <h2>Select</h2>
      <section
        style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}
      >
        <SelectorComponent
          placeholder="Placeholder"
          options={[
            { key: "0", value: "Option 0" },
            { key: "1", value: "Option 1" },
            { key: "2", value: "Option 2" },
            { key: "3", value: "Option 3" },
            { key: "4", value: "Option 4" },
          ]}
          mb="md"
          maw={300}
        />
        <SelectorComponent
          defaultOption="0"
          options={[
            { key: "0", value: "Option 0" },
            { key: "1", value: "Option 1" },
            { key: "2", value: "Option 2" },
            { key: "3", value: "Option 3" },
            { key: "4", value: "Option 4" },
          ]}
          mb="md"
          maw={300}
        />
        <SelectorComponent
          placeholder="Placeholder"
          defaultOption="0"
          options={[
            { key: "0", value: "Option 0" },
            { key: "1", value: "Option 1" },
            { key: "2", value: "Option 2" },
            { key: "3", value: "Option 3" },
            { key: "4", value: "Option 4" },
          ]}
          mb="md"
          maw={300}
        />
      </section>
    </div>
  );
};

export default {
  title: "Components/Palette",
  component: PaletteComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
};

export const Primary = {
  parameters: { backgrounds: { default: "dark" } },
  args: {},
};
