import { useAdmin } from "shared/hooks";
import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from "./hotels.module.scss";
import dayjs from "dayjs";
import {
  ForbiddenIconComponent,
  OfficialIconComponent,
  TableComponent,
  VerifiedIconComponent,
} from "@openhotel/web-components";
import { HotelFormComponent } from "./hotel-form";
import { cn } from "shared/utils";

export const AdminHotelsComponent = () => {
  const { hotels, fetchHotels, fetchUsers } = useAdmin();

  const [selectedHotel, setSelectedHotel] = useState<string>(null);

  useEffect(() => {
    fetchHotels();
    fetchUsers();
  }, [fetchHotels, fetchUsers]);

  useEffect(() => {
    if (
      !selectedHotel ||
      hotels.find((hotel) => hotel.hotelId === selectedHotel)
    )
      return;
    setSelectedHotel(null);
  }, [hotels, selectedHotel, setSelectedHotel]);

  if (!hotels?.length) return null;

  return (
    <div>
      <h2>Hotels</h2>
      <div className={styles.hotels}>
        {selectedHotel ? (
          <HotelFormComponent
            hotel={hotels.find((hotel) => hotel.hotelId === selectedHotel)}
            setHotel={setSelectedHotel}
            onDelete={() => setSelectedHotel(null)}
          />
        ) : null}
        <TableComponent
          title="Hotels"
          searchable={true}
          pageRows={20}
          rowFunc={($row, columns) => {
            return (
              <tr
                key={$row.hotelId + "row"}
                className={cn(styles.row, {
                  [styles.selected]: selectedHotel === $row.hotelId,
                })}
                onClick={() => setSelectedHotel($row.hotelId)}
              >
                {columns.map(($column) => {
                  const value = $row[$column.key];

                  return (
                    <td key={$row.id + $column.key + "row-column"}>{value}</td>
                  );
                })}
              </tr>
            );
          }}
          data={hotels.map((hotel) => {
            return {
              id: hotel.hotelId,
              ...hotel,
              accounts: hotel.accounts.length,
              state: hotel.public ? "public" : "private",
              createdAt: dayjs(hotel.createdAt).format("YYYY/MM/DD HH:mm:ss"),
              badges: (
                <>
                  {hotel.blocked ? (
                    <ForbiddenIconComponent className={styles.icon} />
                  ) : null}
                  {hotel.verified ? (
                    <VerifiedIconComponent className={styles.icon} />
                  ) : null}
                  {hotel.official ? (
                    <OfficialIconComponent className={styles.icon} />
                  ) : null}
                </>
              ),
            };
          })}
          columns={[
            {
              sortable: false,
              key: "badges",
              label: "-",
            },
            {
              sortable: true,
              key: "state",
              label: "State",
            },
            {
              sortable: true,
              key: "username",
              label: "Username",
            },
            {
              sortable: true,
              key: "name",
              label: "Name",
            },
            {
              sortable: true,
              key: "accounts",
              label: "Accounts",
            },
            {
              sortable: true,
              key: "createdAt",
              label: "Created At",
            },
          ]}
        />
      </div>
    </div>
  );
};
