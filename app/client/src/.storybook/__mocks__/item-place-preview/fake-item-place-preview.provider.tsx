import React, { ReactNode, useCallback, useMemo } from "react";
import { ItemPlacePreviewContext } from "../../../shared/hooks";

type Props = {
  children: ReactNode;
};

export const FakeItemPlacePreviewProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const clearItemPreviewData = useCallback(() => null, []);

  const getPreviewItemId = useCallback(() => null, []);

  const renderPreviewItem = useMemo(() => null, []);

  const canPlace = useCallback(() => true, []);

  const setItemPreviewData = useCallback(() => null, [[]]);
  const setCanPlace = useCallback(() => null, [[]]);

  return (
    <ItemPlacePreviewContext.Provider
      value={{
        setItemPreviewData,
        clearItemPreviewData,
        renderPreviewItem,

        getPreviewItemId,

        setCanPlace,
        canPlace,
      }}
      children={children}
    />
  );
};
