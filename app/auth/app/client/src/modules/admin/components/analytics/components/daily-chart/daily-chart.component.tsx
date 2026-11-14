import React, { useEffect, useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryTheme,
} from "victory";
import { useAdmin } from "shared/hooks";
import dayjs, { Dayjs } from "dayjs";

const CustomTickLabel = ({ x, y, text }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      transform="rotate(-30)"
      textAnchor="end"
      dy="0.3em"
      style={{ fontSize: 6, fill: "currentColor" }}
    >
      {text}
    </text>
  </g>
);

const CUSTOM_DARK_THEME = {
  ...VictoryTheme.grayscale,
  axis: {
    ...VictoryTheme.grayscale.axis,
    style: {
      ...VictoryTheme.grayscale.axis.style,
      axis: {
        ...VictoryTheme.grayscale.axis.style.axis,
        stroke: "currentColor",
      },
      tickLabels: {
        ...VictoryTheme.grayscale.axis.style.tickLabels,
        fill: "currentColor",
      },
      grid: {
        ...VictoryTheme.grayscale.axis.style.grid,
        stroke: "currentColor",
        opacity: 0.125,
      },
    },
  },
} as typeof VictoryTheme.grayscale;

type Props = {
  startDate: Dayjs;
  dateRange: string[];
};

export const DailyChartComponent: React.FC<Props> = ({
  startDate,
  dateRange,
}) => {
  const { users, hotels } = useAdmin();
  const [usersData, setUsersData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);

  useEffect(() => {
    if (!users.length) return;

    const formatted = users.map((user) =>
      dayjs(user.createdAt).format("YYYY/MM/DD"),
    );

    const data = dateRange.map((date) => ({
      x: date,
      y: formatted.filter((d) => d === date).length,
    }));

    setUsersData(data);
  }, [users, dateRange]);

  useEffect(() => {
    if (!hotels.length) return;

    const formatted = hotels.map((hotel) =>
      dayjs(hotel.createdAt).format("YYYY/MM/DD"),
    );

    const data = dateRange.map((date) => ({
      x: date,
      y: formatted.filter((d) => d === date).length,
    }));

    setHotelsData(data);
  }, [hotels, dateRange]);

  return (
    <VictoryChart
      theme={CUSTOM_DARK_THEME}
      height={200}
      padding={{ top: 10, bottom: 40, left: 40, right: 0 }}
    >
      <VictoryAxis
        tickValues={dateRange}
        tickFormat={(date) =>
          dayjs(date).date() === 1 ||
          date === startDate.format("YYYY/MM/DD") ||
          date === dayjs().format("YYYY/MM/DD")
            ? date
            : null
        }
        //@ts-ignore
        tickLabelComponent={<CustomTickLabel />}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(t) => (Number.isInteger(t) ? t : "")}
        style={{ tickLabels: { fontSize: 6 } }}
      />

      <VictoryGroup offset={4} colorScale={["#e546c0", "#67be31"]}>
        <VictoryBar data={usersData} />
        <VictoryBar data={hotelsData} />
      </VictoryGroup>

      <VictoryLegend
        x={20}
        y={190}
        orientation="horizontal"
        data={[
          { name: `Users (${users.length})`, symbol: { fill: "#e546c0" } },
          { name: `Hotels (${hotels.length})`, symbol: { fill: "#67be31" } },
        ]}
        style={{
          labels: { fill: "currentColor", fontSize: 6 },
        }}
        standalone={false}
      />
    </VictoryChart>
  );
};
