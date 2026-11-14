import React, { useEffect, useState } from "react";
import { useAdmin } from "shared/hooks";
import dayjs from "dayjs";
import { DailyChartComponent, TimelineChartComponent } from "./components";

export const AnalyticsComponent: React.FC = () => {
  const { users, fetchUsers, fetchHotels } = useAdmin();

  useEffect(() => {
    fetchUsers();
    fetchHotels();
  }, []);

  const [startDate, setStartDate] = useState(dayjs());

  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (!users.length) return;
    const usersSorted = users
      .sort((userA, userB) => userA.createdAt - userB.createdAt)
      .map((user) => ({
        ...user,
        _createdAt: dayjs(user.createdAt).format("YYYY/MM/DD"),
      }));

    const firstRegisteredUser = usersSorted[0];
    const startDate = dayjs(firstRegisteredUser.createdAt);
    setStartDate(startDate);

    const dateRange = [];
    for (let i = 0; i <= dayjs().add(1, "day").diff(startDate, "day"); i++)
      dateRange.push(startDate.add(i, "day").format("YYYY/MM/DD"));

    setDateRange(dateRange);
  }, [users, setDateRange, setStartDate]);

  return (
    <div>
      <h2>Analytics</h2>
      <h4>Timeline</h4>
      <TimelineChartComponent startDate={startDate} dateRange={dateRange} />
      <h4>Daily</h4>
      <DailyChartComponent startDate={startDate} dateRange={dateRange} />
    </div>
  );
};
