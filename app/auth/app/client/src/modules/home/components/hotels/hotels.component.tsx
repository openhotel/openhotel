import { useHotels } from "shared/hooks";
import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from "./hotels.module.scss";
import { PublicHotel, PublicPingClientDataHotel } from "shared/types";
import { ButtonComponent } from "@oh/components";
import { LinkComponent } from "shared/components";
import dayjs from "dayjs";
import { HotelComponent } from "modules/home/components/hotel/hotel.component";

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
          <HotelComponent key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};
