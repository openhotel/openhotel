import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Hotel } from "shared/types";
import {
  ButtonComponent,
  InputComponent,
  SelectorComponent,
} from "@oh/components";
import { IntegrationComponent } from "../integration/integration.component";
import { cn } from "shared/utils";

//@ts-ignore
import styles from "./hotel.module.scss";
import { useHotels } from "shared/hooks";

type Props = {
  hotel: Hotel;

  onRemoveIntegration: (integrationId: string) => () => void;

  refresh: () => void;
} & React.HTMLProps<HTMLDivElement>;

const PUBLIC_PRIVATE_OPTIONS = ["public", "private"].map((value) => ({
  key: value,
  value,
}));

export const HotelComponent: React.FC<Props> = ({
  hotel,
  className,
  onRemoveIntegration,
  refresh,
}) => {
  const {
    remove,
    integrations: { create: createIntegration },
    update,
  } = useHotels();

  const [integrationOptions, setIntegrationOptions] = useState<string[]>([]);

  useEffect(() => {
    const currentIntegrationTypes = hotel.integrations.map(
      (integration) => integration.type,
    );
    setIntegrationOptions(
      ["client", "web"].filter(
        (type) => !currentIntegrationTypes.includes(type),
      ),
    );
  }, [hotel, setIntegrationOptions]);

  const onSubmitIntegration = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const name = data.get("name") as string;
      const redirectUrl = data.get("redirectUrl") as string;
      const type = data.get("type") as string;

      if (
        !name ||
        !redirectUrl ||
        !type ||
        !integrationOptions.length ||
        !integrationOptions.includes(type)
      )
        return;

      createIntegration(hotel.hotelId, name, redirectUrl, type).then(refresh);
    },
    [hotel, createIntegration, refresh, integrationOptions],
  );

  const onRemove = useCallback(async () => {
    await remove(hotel.hotelId);
    refresh();
  }, [hotel, remove, refresh]);

  const integrationSelectorOptions = useMemo(
    () => integrationOptions.map((type) => ({ key: type, value: type })),
    [integrationOptions],
  );

  const publicSelectedOption = useMemo(
    () =>
      PUBLIC_PRIVATE_OPTIONS.find(
        ({ key }) => (hotel.public ? "public" : "private") === key,
      ),
    [hotel],
  );

  const onChangePublicSelector = useCallback(
    (option) => {
      update(hotel.hotelId, hotel.name, option?.key === "public");
    },
    [update, hotel],
  );

  return (
    <div className={cn(styles.hotel, className)}>
      <label>
        {hotel.name} - {hotel.hotelId}
      </label>
      <SelectorComponent
        placeholder="Visibility"
        defaultOption={publicSelectedOption}
        options={PUBLIC_PRIVATE_OPTIONS}
        onChange={onChangePublicSelector}
      />
      <div>integrations:</div>
      <div className={styles.list}>
        {hotel.integrations.map((integration) => (
          <IntegrationComponent
            className={styles.integration}
            key={integration.integrationId}
            hotel={hotel}
            integration={integration}
            onRemove={onRemoveIntegration(integration.integrationId)}
          />
        ))}
        {integrationOptions?.length ? (
          <div className={styles.integration}>
            <form className={styles.form} onSubmit={onSubmitIntegration}>
              <div className={styles.inputs}>
                <InputComponent placeholder="name" name="name" />
                <InputComponent placeholder="redirectUrl" name="redirectUrl" />
                <SelectorComponent
                  placeholder="type"
                  name="type"
                  options={integrationSelectorOptions}
                />
              </div>
              <ButtonComponent>Add integration</ButtonComponent>
            </form>
          </div>
        ) : null}
      </div>
      <ButtonComponent onClick={onRemove} style={{ backgroundColor: "gray" }}>
        delete
      </ButtonComponent>
    </div>
  );
};
