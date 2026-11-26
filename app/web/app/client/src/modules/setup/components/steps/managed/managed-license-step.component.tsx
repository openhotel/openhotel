import React, { useCallback, useMemo, useState } from "react";
import {
  SetupStepProps,
  ManagedLicenseStepForm,
} from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { MANAGED_LICENSE_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";
import { OFFICIAL_NETWORK_URL } from "shared/consts/network.consts.ts";
import {
  getRandomNumber,
  getRandomString,
} from "@shared/utils/random.utils.ts";
import { LabelComponent } from "shared/components/label.component.tsx";

export const ManagedLicenseStepComponent: React.FC<
  SetupStepProps<ManagedLicenseStepForm>
> = ({ onSubmit, defaultValues, setupData, onBack, onChange }) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<ManagedLicenseStepForm>({
    resolver: SETUP_DEBUG
      ? undefined
      : zodResolver(MANAGED_LICENSE_SETUP_SCHEMA),
    mode: "all",
    defaultValues,
    onChange,
  });

  const [verifiedStatus, setVerifiedStatus] = useState<
    "unverified" | "verified" | "not_valid"
  >("unverified");

  const networkUrl = useMemo(
    () =>
      new URL(setupData?.["managed-network"].network ?? OFFICIAL_NETWORK_URL),
    [setupData],
  );

  const onClickVerify = useCallback(() => {
    //TODO <
    setVerifiedStatus(getRandomNumber(0, 1) === 0 ? "not_valid" : "verified");
  }, [setVerifiedStatus]);

  const code = `${getRandomString(4)}-${getRandomString(4)}`;

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">
          {t("setup.steps.managed_license.title")}
        </label>
        <div className="flex flex-col divide-y divide-dotted divide-(--line)">
          {t("setup.steps.managed_license.description")}
        </div>
        <div className="flex flex-col gap-3 divide-y divide-dotted divide-(--line) mt-3">
          <div className="flex justify-between max-w-100">
            <label>{t("setup.steps.managed_license.hotel_code")}</label>
            <label>{code}</label>
          </div>
          <div className="flex gap-3">
            <ButtonComponent type="button" accent>
              {t("setup.steps.managed_license.generate_license", {
                url: networkUrl.host,
              })}
            </ButtonComponent>
            <ButtonComponent type="button">
              {t("setup.steps.managed_license.generate_new_code")}
            </ButtonComponent>
          </div>
        </div>

        <InputComponent
          title={t("setup.steps.managed_license.license.title")}
          hint={t("setup.steps.managed_license.license.hint")}
          placeholder="ohl_..."
          className="max-w-100"
          {...field("license")}
        />
        <div className="flex gap-3 items-center">
          <ButtonComponent
            type="button"
            accent
            className="max-w-100"
            onClick={onClickVerify}
          >
            {t("setup.steps.managed_license.verify_license", {
              url: networkUrl.host,
            })}
          </ButtonComponent>
          <LabelComponent
            accent={verifiedStatus === "verified"}
            error={verifiedStatus === "not_valid"}
          >
            {t(`setup.steps.managed_license.${verifiedStatus}`)}
          </LabelComponent>
        </div>
      </div>
      <div className="mt-auto flex gap-3 justify-end">
        <ButtonComponent type="button" onClick={onBack}>
          {t("setup.navigation.back")}
        </ButtonComponent>
        <ButtonComponent accent>{t("setup.navigation.next")}</ButtonComponent>
      </div>
    </form>
  );
};
