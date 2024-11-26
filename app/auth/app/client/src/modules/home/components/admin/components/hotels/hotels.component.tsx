import { useAdmin } from "shared/hooks";
import React from "react";
//@ts-ignore
import styles from "./hotels.module.scss";

export const HotelsComponent = () => {
  const { hotels } = useAdmin();

  return (
    <div className={styles.hotels}>
      <h3>Hotels</h3>
      <div className={styles.list}>
        {hotels.map((hotel) => (
          <div className={styles.item} key={hotel.hostname}>
            <label>{hotel.hostname}</label>
            <label>({hotel.accounts.length})</label>
            <label>{hotel.verified ? "VERIFIED" : null}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
