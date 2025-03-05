import { parse } from "yaml";
import { HumanData, HumanDirectionData } from "shared/types/human.types";
import { Direction } from "shared/enums";
import { getDirectionInitials } from "shared/utils";
import { System } from "system/system";

export const human = () => {
  let $humanData: HumanData;

  const load = async () => {
    System.loader.addText("Loading human...");
    $humanData = await fetch(`human/human.yml`)
      .then((data) => data.text())
      .then(parse);

    for (const humanDirection of Object.keys($humanData)) {
      $humanData[humanDirection] = {
        ...$humanData[humanDirection],
        directionInitials: getDirectionInitials(
          Direction[humanDirection.toUpperCase()],
        ),
        xScale: 1,
      };
    }

    $humanData.south = {
      ...$humanData.west,
      xScale: -1,
    };
    $humanData.south_east = {
      ...$humanData.north_west,
      xScale: -1,
    };
    $humanData.east = {
      ...$humanData.north,
      xScale: -1,
    };
  };

  const get = (direction: Direction): HumanDirectionData =>
    $humanData[Direction[direction].toLowerCase()];

  return {
    load,
    get,
  };
};
