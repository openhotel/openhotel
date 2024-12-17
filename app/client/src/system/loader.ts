import { loaderComponent } from "modules/loader";
import { global } from "@tu/tulip";

type AddItemsProps = {
  startLabel: string;
  endLabel: string;

  prefix?: string;
  suffix?: string;
  items: string[];
};

export const loader = () => {
  let $loaderComponent;

  let $onMessageCallback;
  let $onPercentageCallback;

  const start = () => {
    $loaderComponent = loaderComponent();
    console.info(">> Start loading!");
    global.getApplication().add($loaderComponent);
  };

  const end = () => {
    console.info("<< Loading completed!");
    global.getApplication().remove($loaderComponent);
  };

  const addText = (text: string) => {
    console.info(">", text);
    $onMessageCallback?.(text);
  };

  const addItems = ({
    startLabel,
    endLabel,
    prefix,
    suffix,
    items,
  }: AddItemsProps) => {
    let $items = [...items];
    console.info(">", startLabel);
    $onPercentageCallback?.(0);
    $onMessageCallback?.(startLabel);

    const resolve = (item: string) => {
      $items = $items.filter(($item) => $item !== item);
      const percentage = 1 - $items.length / items.length;
      $onPercentageCallback?.(percentage);

      const text = `${(prefix ?? "") + (prefix ? " " : "")}${item} ${suffix ?? ""}`;
      console.info("-", text);
      $onMessageCallback?.(text);

      if (percentage === 1) {
        console.info("<", endLabel);
        $onMessageCallback?.(endLabel);
      }
    };

    return {
      resolve,
    };
  };

  const onMessage = (callback: (message: string) => void) =>
    ($onMessageCallback = callback);
  const onPercentage = (callback: (percentage: number) => void) =>
    ($onPercentageCallback = callback);

  return {
    start,
    end,

    addText,
    addItems,

    onMessage,
    onPercentage,
  };
};
