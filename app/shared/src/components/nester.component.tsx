import React, { useMemo } from "react";

type Props = {
  components: React.FC<React.PropsWithChildren<any>>[];
} & React.PropsWithChildren;

export const NesterComponent: React.FC<Props> = ({ components, children }) => {
  const renderComponents = useMemo(
    () =>
      components.reduceRight<React.ReactNode>(
        (inner, CurrentComponent, index) => (
          <CurrentComponent key={index}>{inner}</CurrentComponent>
        ),
        children ?? null,
      ),
    [components, children],
  );

  return <>{renderComponents}</>;
};
