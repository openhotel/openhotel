import React from "react";
import { Outlet } from "react-router";
import { RouterComponent } from "modules/application/components/router.component.tsx";
import { LanguageProvider } from "shared/hooks/language/language.provider.tsx";

export const ApplicationComponent = () => {
  return (
    <LanguageProvider>
      <RouterComponent>
        <Outlet />
      </RouterComponent>
    </LanguageProvider>
  );
};
