import React, { StrictMode, useMemo } from "react";
import "./style.css";
import { ApplicationProvider } from "@openhotel/pixi-components";
import { withConsole } from "@storybook/addon-console";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
} from "../src/modules/application";
import { AssetsProvider } from "../src/shared/hooks";
import { SBFurnitureProvider } from "../src/.storybook";

/** @type { import('@storybook/react').Preview } */
const preview = {
  previewHead: (head) => `
    ${head}
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  `,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  globalTypes: {
    scale: {
      description: "scale canvas",
      defaultValue: 3,
      toolbar: {
        title: "Scale 3",
        items: [
          { value: 1, title: "Scale 1" },
          { value: 2, title: "Scale 2" },
          { value: 3, title: "Scale 3" },
          { value: 4, title: "Scale 4" },
          { value: 5, title: "Scale 5" },
          { value: 6, title: "Scale 6" },
        ],
        dynamicTitle: true,
      },
    },
    fps: {
      description: "show fps",
      defaultValue: false,
      toolbar: {
        title: "FPS off",
        items: [
          { value: false, title: "FPS off" },
          { value: true, title: "FPS on" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
export const decorators = [
  (renderStory, props) => {
    const scale = useMemo(() => props.globals.scale, [props]);
    // const isConsole = useMemo(() => props.globals.console, [props]);

    const backgroundColor = useMemo(() => {
      const { backgrounds } = props.parameters;

      return (
        props?.globals?.backgrounds?.value ??
        backgrounds.values?.find(({ name }) => backgrounds.default === name)
          ?.value ??
        0x1
      );
    }, [props]);

    return (
      <StrictMode>
        <ApplicationProvider scale={scale} backgroundColor={backgroundColor}>
          <InitialLoaderComponent>
            <AssetsProvider>
              <CoreLoaderComponent>
                <SBFurnitureProvider>
                  {withConsole()(renderStory)(props)}
                </SBFurnitureProvider>
              </CoreLoaderComponent>
            </AssetsProvider>
          </InitialLoaderComponent>
        </ApplicationProvider>
      </StrictMode>
    );
  },
];
