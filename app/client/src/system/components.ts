import { ComponentMutable } from "@tu/tulip/_dist";

export const components = () => {
  const $componentMap: Record<string, ComponentMutable> = {};

  const setComponent = (id: string, displayObject: ComponentMutable) => {
    $componentMap[id] = displayObject;
  };
  const getComponent = <Type>(id: string): Type => $componentMap[id] as Type;

  const deleteComponent = (id: string) => {
    delete $componentMap[id];
  };

  return {
    setComponent,
    getComponent,
    deleteComponent,
  };
};
