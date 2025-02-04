import React, { useCallback, useEffect, useState } from "react";
import { HotelCardComponent } from "@oh/components";
import { HotelInfo, PublicHotel } from "shared/types";

type Props = {
  hotel: PublicHotel;
};

export const HotelComponent: React.FC<Props> = ({ hotel }) => {
  const [pingMs, setPingMs] = useState<number>(undefined);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(undefined);

  const $getHotelUrl = useCallback(
    (pathname: string) => {
      const pingUrl = new URL(hotel.client.url);
      pingUrl.pathname = pathname;
      return pingUrl;
    },
    [hotel],
  );

  const $ping = useCallback(() => {
    let initialDate = Date.now();
    fetch($getHotelUrl("info"))
      .then((response) => {
        setPingMs(Date.now() - initialDate);
        return response.json();
      })
      .then(({ status, data }) => {
        if (status !== 200) return setPingMs(undefined);

        setHotelInfo(data);
      })
      .catch(() => {
        setPingMs(undefined);
      });
  }, [$getHotelUrl, setPingMs, setHotelInfo]);

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
      title={hotelInfo?.name ?? hotel.name}
      description={hotelInfo?.description ?? ""}
      logo={hotelInfo ? $getHotelUrl("icon") : "/hotel/hotel-logo.webp"}
      background={
        hotelInfo ? $getHotelUrl("background") : "/hotel/hotel-background.webp"
      }
      onClickWebsite={hotel.web?.url ? onClickWebsite : undefined}
      onClickClient={onClickClient}
      ms={pingMs}
      joinedUsers={hotel.accounts}
      createdAt={hotel.createdAt}
      version={hotelInfo?.version}
      users={hotelInfo?.users}
      maxUsers={hotelInfo?.maxUsers}
      onet={hotelInfo?.onet?.enabled}
    />
  );
};
