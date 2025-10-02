import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DbHotel,
  DbHotelIntegration,
  DbHotelIntegrationType,
  HotelInfo,
} from "shared/types";
import {
  ButtonComponent,
  ConfirmationModalComponent,
  CrossIconComponent,
  ForbiddenIconComponent,
  FormComponent,
  InputComponent,
  NetworkIconComponent,
  OfficialIconComponent,
  SelectorComponent,
  useModal,
  VerifiedIconComponent,
} from "@openhotel/web-components";
import styles from "./hotel-form.module.scss";
import { useAdmin, useHotel } from "shared/hooks";
import { cn } from "shared/utils";
import dayjs from "dayjs";

type Props = {
  hotel: DbHotel;
  setHotel: (hotelId: string) => void;
  onDelete: () => void;
};

export const HotelFormComponent: React.FC<Props> = ({
  hotel,
  setHotel,
  onDelete,
}) => {
  const { getHotelInfo, getHotelUrl } = useHotel();

  const { fetchHotels, updateHotel, deleteHotel, deleteHotelIntegration } =
    useAdmin();

  const { close, open } = useModal();

  const [hotelPing, setHotelPing] = useState<number>(undefined);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(undefined);

  const onSubmitUpdate = useCallback(async ({}: any) => {}, [hotel]);

  const hotelAccountsOptions = useMemo(
    () =>
      hotel.accounts.map((user) => ({
        key: user.accountId,
        value: user.username,
      })),
    [hotel],
  );

  useEffect(() => {
    const clientIntegration = hotel.integrations.find(
      (integration) => integration.type === DbHotelIntegrationType.CLIENT,
    );
    if (!clientIntegration) return;

    getHotelInfo(clientIntegration.redirectUrl).then(({ data, ping }) => {
      setHotelInfo(data);
      setHotelPing(ping);
    });
  }, [hotel, setHotelInfo, setHotelPing, getHotelInfo]);

  const $onDeleteHotel = useCallback(() => {
    deleteHotel(hotel.hotelId).then(() => {
      fetchHotels();
      onDelete();
    });
  }, [deleteHotel, fetchHotels, onDelete]);

  const $onDeleteIntegration = useCallback(
    (integration: DbHotelIntegration) => () => {
      deleteHotelIntegration(hotel.hotelId, integration.integrationId).then(
        fetchHotels,
      );
    },
    [hotel, deleteHotelIntegration, fetchHotels],
  );

  const $onBlockHotel = useCallback(() => {
    updateHotel(hotel.hotelId, {
      blocked: !hotel.blocked,
    }).then(fetchHotels);
  }, [hotel, updateHotel, fetchHotels]);

  const $onVerifyHotel = useCallback(() => {
    updateHotel(hotel.hotelId, {
      verified: !hotel.verified,
    }).then(fetchHotels);
  }, [hotel, updateHotel, fetchHotels]);

  const $onMakeOfficialHotel = useCallback(() => {
    updateHotel(hotel.hotelId, {
      official: !hotel.official,
    }).then(fetchHotels);
  }, [hotel, updateHotel, fetchHotels]);

  return (
    <div className={styles.selectedForm}>
      <FormComponent onSubmit={onSubmitUpdate}>
        <div className={styles.header}>
          <label></label>
          <CrossIconComponent
            className={styles.icon}
            onClick={() => setHotel(null)}
          />
        </div>
        <div className={styles.formRow}>
          <InputComponent
            placeholder="Hotel Id"
            value={hotel.hotelId}
            disabled={true}
          />
          <InputComponent
            placeholder="Owner"
            value={hotel.username}
            disabled={true}
          />
        </div>
        <div className={styles.formRow}>
          <InputComponent
            placeholder="CreatedAt"
            value={dayjs(hotel.createdAt).format("YYYY/MM/DD HH:mm:ss")}
            disabled={true}
          />
          <InputComponent
            placeholder="UpdatedAt"
            value={dayjs(hotel.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
            disabled={true}
          />
        </div>
        <div className={styles.formRow}>
          <InputComponent
            placeholder="Name"
            value={hotel.name}
            disabled={true}
          />
          <SelectorComponent
            placeholder="Accounts"
            options={hotelAccountsOptions}
            clearable={false}
          />
        </div>
        <div className={styles.formColumn}>
          <h4>Integrations ({hotel.integrations.length})</h4>
          <div className={styles.formColumn}>
            {hotel.integrations.map((integration) => {
              return (
                <div
                  className={cn(styles.formColumn, styles.integration)}
                  key={integration.integrationId}
                >
                  {integration.type === "client" && hotelInfo ? (
                    <div className={styles.live}>
                      <div className={styles.formRow}>
                        <span>{hotelInfo.version}</span>
                        {hotelInfo.onet ? <NetworkIconComponent /> : null}
                        <span>
                          {hotelInfo.users}/{hotelInfo.maxUsers}
                        </span>
                        <span>{hotelPing}ms</span>
                      </div>
                      <div className={styles.formRow}>
                        <span>{hotelInfo.name}</span>
                        <span>{hotelInfo.description}</span>
                      </div>
                      <div>
                        <img
                          src={getHotelUrl(integration.redirectUrl, "icon")}
                        />
                        <img
                          src={getHotelUrl(
                            integration.redirectUrl,
                            "background",
                          )}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className={styles.formRow}>
                    <InputComponent
                      placeholder="Integration Id"
                      value={integration.integrationId}
                      disabled={true}
                    />
                    <InputComponent
                      placeholder="Type"
                      value={integration.type}
                      disabled={true}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <InputComponent
                      placeholder="Created At"
                      value={dayjs(integration.createdAt).format(
                        "YYYY/MM/DD HH:mm:ss",
                      )}
                      disabled={true}
                    />
                    <InputComponent
                      placeholder="Updated At"
                      value={dayjs(integration.updatedAt).format(
                        "YYYY/MM/DD HH:mm:ss",
                      )}
                      disabled={true}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <InputComponent
                      placeholder="Name"
                      defaultValue={integration.name}
                      disabled={true}
                    />
                    <InputComponent
                      placeholder="RedirectUrl"
                      defaultValue={integration.redirectUrl}
                      disabled={true}
                    />
                    <SelectorComponent
                      placeholder="Integration accounts"
                      options={integration.accounts.map((account) => ({
                        key: account.accountId,
                        value: account.username,
                      }))}
                      clearable={false}
                    />
                  </div>
                  <div>
                    <ButtonComponent
                      color="grey"
                      onClick={() =>
                        open({
                          children: (
                            <ConfirmationModalComponent
                              description="Are you sure you want to delete the integration?"
                              onClose={close}
                              onConfirm={$onDeleteIntegration(integration)}
                            />
                          ),
                        })
                      }
                    >
                      Delete
                    </ButtonComponent>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn(styles.formRow, styles.actions)}>
          <ButtonComponent
            color="grey"
            onClick={() =>
              open({
                children: (
                  <ConfirmationModalComponent
                    description="Are you sure you want to delete the hotel?"
                    onClose={close}
                    onConfirm={$onDeleteHotel}
                  />
                ),
              })
            }
          >
            Delete
          </ButtonComponent>
          <div className={cn(styles.formRow, styles.subActions)}>
            <ButtonComponent onClick={$onBlockHotel} color="grey">
              <ForbiddenIconComponent className={styles.icon} />{" "}
              {hotel.blocked ? "Unblock" : "Block"}
            </ButtonComponent>
            <ButtonComponent
              onClick={$onVerifyHotel}
              color={hotel.verified ? "grey" : "yellow"}
            >
              <VerifiedIconComponent className={styles.icon} />{" "}
              {hotel.verified ? "Unverify" : "Verify"}
            </ButtonComponent>
            <ButtonComponent
              onClick={$onMakeOfficialHotel}
              color={hotel.official ? "grey" : "yellow"}
            >
              <OfficialIconComponent className={styles.icon} /> Make it{" "}
              {hotel.official ? "Unofficial" : "Official"}
            </ButtonComponent>
          </div>
        </div>
      </FormComponent>
    </div>
  );
};
