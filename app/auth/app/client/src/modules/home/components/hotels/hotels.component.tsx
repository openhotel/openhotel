import { useHotels } from "shared/hooks";
import React, { useCallback, useEffect, useState } from "react";
//@ts-ignore
import styles from "./hotels.module.scss";
import { PublicHotel } from "shared/types";
import { HotelComponent } from "modules/home/components/hotel/hotel.component";

export const HotelsComponent = () => {
  const { getList } = useHotels();
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [pingData, setPingData] = useState<Record<string, number | undefined>>(
    {},
  );

  useEffect(() => {
    getList().then(setHotels);
  }, [getList]);

  const updatePing = useCallback(
    (hotelId: string, ping: number | undefined) => {
      setPingData((prev) => {
        const newPingData = { ...prev, [hotelId]: ping };

        setHotels((prevHotels) =>
          [...prevHotels].sort((a, b) => {
            const pingA = newPingData[a.id];
            const pingB = newPingData[b.id];

            const isAReachable = pingA !== undefined;
            const isBReachable = pingB !== undefined;

            // Prioritize reachable hotels over unreachable ones
            if (isAReachable !== isBReachable) {
              return isAReachable ? -1 : 1;
            }

            // Among reachable hotels, sort by user count (descending)
            if (b.accounts !== a.accounts) {
              return b.accounts - a.accounts;
            }

            // If user count is the same, sort by ping (ascending)
            return (pingA ?? Infinity) - (pingB ?? Infinity);
          }),
        );

        return newPingData;
      });
    },
    [],
  );

  return (
    <div className={styles.hotels}>
      <h2>Public Hotels</h2>
      <div className={styles.list}>
        {hotels.map((hotel) => (
          <HotelComponent
            key={hotel.id}
            hotel={hotel}
            updatePing={updatePing}
          />
        ))}
      </div>
    </div>
  );
};
