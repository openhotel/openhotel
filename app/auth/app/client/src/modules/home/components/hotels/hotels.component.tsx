import { useHotels } from "shared/hooks";
import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from "./hotels.module.scss";
import { PublicHotel } from "shared/types";
import { ButtonComponent } from "@oh/components";
import { LinkComponent } from "shared/components";
import dayjs from "dayjs";

export const HotelsComponent = () => {
  const { getList } = useHotels();

  const [hotels, setHotels] = useState<PublicHotel[]>([]);

  useEffect(() => {
    getList().then((hotels) =>
      setHotels(
        hotels.sort((hotelA, hotelB) => hotelB.accounts - hotelA.accounts),
      ),
    );
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
              <div className={styles.gradient} />
            </div>
            <div className={styles.content}>
              <div className={styles.contentHeader}>
                <span>
                  <b>{hotel.name} </b>
                  <a className={styles.owner}>by {hotel.owner}</a>
                </span>
                <label>
                  founded at {dayjs(hotel.createdAt).format("DD MMM YYYY")}
                </label>
                <a>
                  {hotel.accounts} account{hotel.accounts === 1 ? "" : "s"}{" "}
                  already joined!
                </a>
              </div>
              <div className={styles.contentActions}>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
