import React, { useCallback, useState } from "react";
import { useUser } from "shared/hooks";
//@ts-ignore
import styles from "./license.module.scss";
import { ButtonComponent } from "@oh/components";

export const LicenseComponent: React.FC = () => {
  const { getLicense } = useUser();

  const [licenseToken, setLicenseToken] = useState<string>();

  const generateLicense = useCallback(() => {
    getLicense().then(setLicenseToken);
  }, [getLicense]);

  return (
    <div className={styles.container}>
      <h2>License</h2>
      <div>
        <div>Generating a new license will remove the old license.</div>
        <ButtonComponent onClick={generateLicense}>
          Generate hotel license
        </ButtonComponent>
        {licenseToken ? (
          <div className={styles.license}>{licenseToken}</div>
        ) : null}
        <div>
          This token grants access to the auth system and can be used only for
          one hotel.
        </div>
        <div>
          Don’t share this token with anyone. It’s unique to your account, and
          any misuse could lead to your account being banned. Keep it safe!
        </div>
      </div>
    </div>
  );
};
