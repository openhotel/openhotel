import React, { useCallback, useState } from "react";
import { Hotel, HotelIntegration } from "shared/types";
import { useMyHotels } from "shared/hooks";
import { ButtonComponent } from "@oh/components";
import { cn } from "shared/utils";

//@ts-ignore
import styles from "./integration.module.scss";

type Props = {
  hotel: Hotel;
  integration: HotelIntegration;
  onRemove: () => void;
} & React.HTMLProps<HTMLDivElement>;

export const IntegrationComponent: React.FC<Props> = ({
  hotel,
  integration,
  className,
  onRemove: $onRemove,
}) => {
  const {
    integrations: { generate, remove },
  } = useMyHotels();
  const [licenseToken, setLicenseToken] = useState<string>(null);

  const onGenerateLicense = useCallback(async () => {
    const license = await generate(hotel.hotelId, integration.integrationId);
    setLicenseToken(license);
  }, [hotel, integration, setLicenseToken]);

  const onRemove = useCallback(async () => {
    await remove(hotel.hotelId, integration.integrationId);
    $onRemove();
  }, [hotel, integration, $onRemove, remove]);

  return (
    <div className={cn(styles.integration, className)}>
      <label>
        {integration.name} - {integration.integrationId} - {integration.type}
      </label>
      <a href={integration.redirectUrl} target="_blank">
        {integration.redirectUrl}
      </a>
      <div>accounts: {integration.accounts}</div>
      {licenseToken ? (
        <div className={styles.license}>{licenseToken}</div>
      ) : null}
      <div className={styles.actions}>
        <div>
          <ButtonComponent onClick={onGenerateLicense}>
            Generate license
          </ButtonComponent>
        </div>
        <ButtonComponent onClick={onRemove} style={{ backgroundColor: "gray" }}>
          delete
        </ButtonComponent>
      </div>
    </div>
  );
};
