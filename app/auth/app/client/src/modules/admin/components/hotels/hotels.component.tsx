import { useAdmin } from "shared/hooks";
import React from "react";
//@ts-ignore
import styles from "./hotels.module.scss";

export const AdminHotelsComponent = () => {
  // const { hotels } = useHotels();
  const { hotels, users } = useAdmin();

  if (!hotels?.length) return null;

  return (
    <div>
      <h2>Hotels</h2>
      <div className={styles.list}>
        {hotels.map((hotel) => (
          <div key={hotel.hotelId} className={styles.item}>
            <label>{hotel.hotelId}</label>
            <label>{hotel.name}</label>
            <label>{hotel.public ? "public" : "private"}</label>

            <div>
              <label>integrations</label>
              <div>
                {hotel.integrations.map((integration) => (
                  <div key={integration.integrationId}>
                    <label>{integration.integrationId}</label>
                    <label>{integration.name}</label>
                    <label>{integration.redirectUrl}</label>
                    <label>{integration.type}</label>

                    <div>
                      {integration.connections.map((connection) => (
                        <div
                          key={integration.integrationId + connection.accountId}
                        >
                          <div>{connection.accountId}</div>
                          <div>
                            {
                              users.find(
                                (user) =>
                                  user.accountId === connection.accountId,
                              ).username
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
