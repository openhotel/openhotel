import { useHotels } from "shared/hooks";
import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from "./hotels.module.scss";
import { PublicHotel } from "shared/types";
import { ButtonComponent } from "@oh/components";
import { LinkComponent } from "shared/components";

export const HotelsComponent = () => {
  const { getList } = useHotels();

  const [hotels, setHotels] = useState<PublicHotel[]>([]);

  useEffect(() => {
    getList().then(setHotels);
  }, [getList]);

  return (
    <div className={styles.hotels}>
      <h2>Public Hotels</h2>
      <div className={styles.list}>
        {hotels.map((hotel) => (
          <div className={styles.hotel} key={hotel.id}>
            <div
              className={styles.header}
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
              <i className={styles.owner}>by {hotel.owner}</i>
              <div className={styles.gradient} />
            </div>
            <div className={styles.content}>
              {hotel.web ? (
                <div className={styles.contentItem}>
                  <div className={styles.contentHeader}>
                    <label>{hotel.web.accounts} accounts</label>
                  </div>
                  <div>
                    <LinkComponent to={hotel.web.url} target="_blank">
                      <ButtonComponent variant="3d">
                        Visit the website!
                      </ButtonComponent>
                    </LinkComponent>
                  </div>
                </div>
              ) : null}
              {hotel.client ? (
                <div className={styles.contentItem}>
                  <div className={styles.contentHeader}>
                    <label>{hotel.client.accounts} accounts</label>
                  </div>
                  <LinkComponent to={hotel.client.url} target="_blank">
                    <ButtonComponent color="yellow" variant="3d">
                      Check in!
                    </ButtonComponent>
                  </LinkComponent>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
