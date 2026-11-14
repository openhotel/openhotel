import React, { useMemo } from "react";

type Props = {
  components: React.FC<React.PropsWithChildren<any>>[];
};

export const NesterComponent: React.FC<Props> = ({ components }) => {
  const renderComponents = useMemo(
    () =>
      components.reduceRight((children: unknown, CurrentComponent, index) => {
        // Pass children as the inner component, add a key to avoid React warnings
        return <CurrentComponent key={index} children={children} />;
      }, null),
    [components],
  );

  return <>{renderComponents}</>;
};
