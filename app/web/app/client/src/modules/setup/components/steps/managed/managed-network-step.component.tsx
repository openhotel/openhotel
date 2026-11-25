import React, { ChangeEvent, useCallback, useState } from "react";
import {
  SetupStepProps,
  ManagedNetworkStepForm,
} from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { MANAGED_NETWORK_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";
import { OFFICIAL_NETWORK_URL } from "shared/consts/network.consts.ts";
import { SelectComponent } from "shared/components/forms/select.component.tsx";
import { LabelComponent } from "shared/components/label.component.tsx";
import { getRandomNumber } from "@shared/utils/random.utils.ts";

export const ManagedNetworkStepComponent: React.FC<
  SetupStepProps<ManagedNetworkStepForm>
> = ({ onSubmit, defaultValues, setupData, onBack }) => {
  const { t } = useTranslation();

  const { field, handleSubmit, setValue } = useAppForm<ManagedNetworkStepForm>({
    resolver: SETUP_DEBUG
      ? undefined
      : zodResolver(MANAGED_NETWORK_SETUP_SCHEMA),
    mode: "all",
    defaultValues: { network: OFFICIAL_NETWORK_URL, ...defaultValues },
  });
  const [disabled, setDisabled] = useState<boolean>(
    (defaultValues?.network ?? OFFICIAL_NETWORK_URL) === OFFICIAL_NETWORK_URL,
  );
  const [checkStatus, setCheckStatus] = useState<
    "unchecked" | "reachable" | "not_reachable"
  >("unchecked");

  const onChangeSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const disabled = event.target.value === "official";
      setValue("network", disabled ? OFFICIAL_NETWORK_URL : "");
      setDisabled(disabled);
    },
    [setValue],
  );

  const onClickCheck = useCallback(() => {
    //TODO <
    setCheckStatus(getRandomNumber(0, 1) === 0 ? "not_reachable" : "reachable");
  }, [setCheckStatus]);

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">
          {t("setup.steps.managed_network.title")}
        </label>
        <SelectComponent
          title={t("setup.steps.managed_network.network.title")}
          onChange={onChangeSelect}
          className="max-w-100"
          defaultValue={disabled ? "official" : "custom"}
        >
          <option value="official">
            {OFFICIAL_NETWORK_URL} ({t("setup.steps.managed_network.official")})
          </option>
          <option value="custom">
            {t("setup.steps.managed_network.other_network")}
          </option>
        </SelectComponent>
        <InputComponent
          title={t("setup.steps.managed_network.network_url.title")}
          hint={t("setup.steps.managed_network.network_url.hint")}
          type="url"
          className="max-w-100"
          disabled={disabled}
          {...field("network")}
        />
        <div className="flex gap-3 items-center">
          <ButtonComponent type="button" onClick={onClickCheck}>
            {t("setup.steps.managed_network.check")}
          </ButtonComponent>
          <LabelComponent
            accent={checkStatus === "reachable"}
            error={checkStatus === "not_reachable"}
          >
            {t(`setup.steps.managed_network.${checkStatus}`)}
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
