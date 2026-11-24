import React, { useEffect, useMemo } from "react";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useTranslation } from "react-i18next";
import { SetupFormData, SetupStepProps } from "shared/types/setup.types.ts";

export const ReviewStepComponent: React.FC<SetupStepProps> = ({
  setupData,
  onBack,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log(Object.keys(setupData!));
  }, []);

  const setupKeys = useMemo(
    () => Object.keys(setupData!) as unknown[] as (keyof SetupFormData)[],
    [setupData],
  );

  console.log(setupData);
  return (
    <form className="p-card flex gap-6 flex-col">
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.steps.review.title")}</label>
        <label>{t("setup.steps.review.description")}</label>
        <div className="flex flex-col max-w-140">
          {setupKeys.map((setupKey) => {
            const data = setupData![setupKey] as Record<string, string>;
            return (
              <div className="flex flex-col divide-y divide-dotted divide-(--line)">
                <label className="font-bold mt-3 py-1">
                  {t(`setup.steps.${setupKey}.label`)}
                </label>
                {Object.keys(data)
                  .filter((key) => !key.includes("password"))
                  .map((key) => (
                    <div
                      key={setupKey + key}
                      className="flex justify-between py-1"
                    >
                      <label>{t(`setup.steps.${setupKey}.${key}.title`)}</label>
                      <label className="font-bold">{data[key]}</label>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-auto flex gap-3 justify-end">
        <ButtonComponent type="button" onClick={onBack}>
          {t("setup.navigation.back")}
        </ButtonComponent>
        <ButtonComponent accent>
          {t("setup.navigation.finish_setup")}
        </ButtonComponent>
      </div>
    </form>
  );
};
