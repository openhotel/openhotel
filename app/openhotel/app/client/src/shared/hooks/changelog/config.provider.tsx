import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChangelogContext } from "./changelog.context";
import { LoaderComponent } from "shared/components";
import { useTranslation } from "react-i18next";
import { useConfig } from "shared/hooks/config";

type ChangelogProps = {
  children: ReactNode;
};

export const ChangelogProvider: React.FunctionComponent<ChangelogProps> = ({
  children,
}) => {
  const { getVersion, getLastVersion } = useConfig();
  const { t } = useTranslation();
  const changeLogRef = useRef<unknown>(null);

  const [loadingMessage, setLoadingMessage] = useState<string>(
    t("system.loading_changelog"),
  );

  useEffect(() => {
    const version = getVersion();
    const lastVersion = getLastVersion();

    if (lastVersion === version) return setLoadingMessage(null);

    fetch(`/changelog?from=${lastVersion}`)
      .then((response) => response.json())
      .then((data) => {
        changeLogRef.current = data;
      })
      .finally(() => setLoadingMessage(null));
  }, [t, setLoadingMessage, getLastVersion, getLastVersion, getVersion]);

  const getChangeLog = useCallback(() => changeLogRef.current, []);

  return (
    <ChangelogContext.Provider
      value={{
        getChangeLog,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};
