import React, { ReactNode, useCallback, useState } from "react";
import { ModerationContext } from "./moderation.context";

type ModerationProps = {
  children: ReactNode;
};

export const ModerationProvider: React.FunctionComponent<ModerationProps> = ({
  children,
}) => {
  const [openConsoleNow, setOpenConsoleNow] = useState<number>(null);
  const [closeConsoleNow, setCloseConsoleNow] = useState<number>(null);
  const [clearConsoleNow, setClearConsoleNow] = useState<number>(null);

  const openConsole = useCallback(
    () => setOpenConsoleNow(Date.now()),
    [setOpenConsoleNow],
  );
  const closeConsole = useCallback(
    () => setCloseConsoleNow(Date.now()),
    [setCloseConsoleNow],
  );
  const clearConsole = useCallback(
    () => setClearConsoleNow(Date.now()),
    [setClearConsoleNow],
  );

  return (
    <ModerationContext.Provider
      value={{
        openConsoleNow,
        closeConsoleNow,
        clearConsoleNow,
        openConsole,
        closeConsole,
        clearConsole,
      }}
      children={children}
    />
  );
};
