import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { LinkComponent } from "shared/components";
import { ButtonComponent } from "@oh/components";
import { PublicHotel } from "shared/types";
//@ts-ignore
import styles from "./hotel.module.scss";
import { PingHotelStatus } from "shared/enums";
import { cn } from "shared/utils";

type Props = {
  hotel: PublicHotel;
};

export const HotelComponent: React.FC<Props> = ({ hotel }) => {
  const [pingClientStatus, setPingClientStatus] = useState<PingHotelStatus>(
    PingHotelStatus.LOADING,
  );
  const [clientVersion, setClientVersion] = useState<string>(null);

  const $ping = useCallback(() => {
    const pingUrl = new URL(hotel.client.url);
    pingUrl.pathname = "version";
    fetch(pingUrl.href)
      .then((response) => response.json())
      .then(({ status, data }) => {
        if (status !== 200)
          return setPingClientStatus(PingHotelStatus.NOT_REACHED);

        setClientVersion(data.version);
        setPingClientStatus(PingHotelStatus.REACHED);
      })
      .catch(() => {
        setPingClientStatus(PingHotelStatus.NOT_REACHED);
      });
  }, [hotel, setPingClientStatus, setClientVersion]);

  useEffect(() => {
    if (!hotel.client) {
      setPingClientStatus(PingHotelStatus.NOT_REACHED);
      return;
    }

    $ping();

    const interval = setInterval($ping, 60_000);
    return () => clearInterval(interval);
  }, [$ping]);

  const hasNotReached = useMemo(
    () => pingClientStatus === PingHotelStatus.NOT_REACHED,
    [pingClientStatus],
  );
  const hasReached = useMemo(
    () => pingClientStatus === PingHotelStatus.REACHED,
    [pingClientStatus],
  );

  return (
    <div className={styles.hotel} key={hotel.id}>
      <div
        className={cn(styles.header, {
          [styles.notReached]: hasNotReached,
        })}
        style={{
          backgroundImage: `url(hotel/hotel-background.webp)`,
        }}
      >
        <div
          className={styles.logo}
          style={{
            backgroundImage: `url(hotel/hotel-logo.webp)`,
          }}
        />
        <div className={styles.gradient} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          {hasNotReached ? <b className={styles.offline}>OFFLINE</b> : null}
          {hasReached ? (
            <b className={styles.online}>ONLINE ({clientVersion})</b>
          ) : null}
          <span>
            <b>{hotel.name} </b>
            <a className={styles.owner}>by {hotel.owner}</a>
          </span>
          <label>
            founded on {dayjs(hotel.createdAt).format("DD MMM YYYY")}
          </label>
          <a>
            {hotel.accounts} user{hotel.accounts === 1 ? "" : "s"} already
            joined!
          </a>
        </div>
        <div className={styles.contentActions}>
          {hasReached ? (
            <>
              {hotel.web ? (
                <div className={styles.action}>
                  <LinkComponent to={hotel.web.url} target="_blank">
                    <ButtonComponent variant="3d">
                      Visit the website!
                    </ButtonComponent>
                  </LinkComponent>
                </div>
              ) : null}
              {hotel.client ? (
                <div className={styles.action}>
                  <LinkComponent to={hotel.client.url} target="_blank">
                    <ButtonComponent color="yellow" variant="3d">
                      Check in!
                    </ButtonComponent>
                  </LinkComponent>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
