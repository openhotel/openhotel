import React, { useCallback, useEffect, useState } from "react";
import { HotelCardComponent } from "@oh/components";
import { HotelInfo, PublicHotel } from "shared/types";
import { useHotel } from "shared/hooks";

type Props = {
  hotel: PublicHotel;
  updatePing: (hotelId: string, ping: number | undefined) => void;
};

export const HotelComponent: React.FC<Props> = ({ hotel, updatePing }) => {
  const { getHotelUrl, getHotelInfo } = useHotel();

  const [pingMs, setPingMs] = useState<number>(undefined);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(undefined);

  const $ping = useCallback(async () => {
    const response = (await getHotelInfo(hotel.client.url)) as any;
    if (!response) return;

    setPingMs(response.ping);
    setHotelInfo(response.data);
    updatePing(hotel.id, response.ping);
  }, [getHotelInfo, setPingMs, setHotelInfo]);

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
      official={hotel.official}
      verified={hotel.verified}
      owner={hotel.owner}
      title={hotelInfo?.name ?? hotel.name}
      description={hotelInfo?.description ?? ""}
      logo={
        hotelInfo
          ? getHotelUrl(hotel.client.url, "icon")
          : "/hotel/hotel-logo.webp"
      }
      background={
        hotelInfo
          ? getHotelUrl(hotel.client.url, "background")
          : "/hotel/hotel-background.webp"
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
