import React, { useCallback, useEffect, useState } from "react";
import { HotelCardComponent } from "@oh/components";
import { PublicHotel } from "shared/types";

type Props = {
  hotel: PublicHotel;
};

export const HotelComponent: React.FC<Props> = ({ hotel }) => {
  const [pingMs, setPingMs] = useState<number>(undefined);
  const [clientVersion, setClientVersion] = useState<string>(undefined);

  const $ping = useCallback(() => {
    const pingUrl = new URL(hotel.client.url);
    pingUrl.pathname = "version";

    let initialDate = Date.now();
    fetch(pingUrl.href)
      .then((response) => {
        setPingMs(Date.now() - initialDate);
        return response.json();
      })
      .then(({ status, data }) => {
        if (status !== 200) return setPingMs(undefined);

        setClientVersion(data.version);
      })
      .catch(() => {
        setPingMs(undefined);
      });
  }, [hotel, setPingMs, setClientVersion]);

  useEffect(() => {
    $ping();

    const interval = setInterval($ping, 60_000);
    return () => clearInterval(interval);
  }, [$ping]);

  const onClickWebsite = useCallback(() => {
    open(hotel.web.url, "_blank");
  }, []);
  const onClickClient = useCallback(() => {
    open(hotel.client.url, "_blank");
  }, []);

  return (
    <HotelCardComponent
      official={false}
      verified={false}
      owner={hotel.owner}
      title={hotel.name}
      description={"This is a default description"}
      logo={"/hotel/hotel-logo.webp"}
      background={"/hotel/hotel-background.webp"}
      onClickWebsite={hotel.web?.url ? onClickWebsite : undefined}
      onClickClient={onClickClient}
      ms={pingMs}
      joinedUsers={hotel.accounts}
      createdAt={hotel.createdAt}
      version={clientVersion}
    />
  );
};
