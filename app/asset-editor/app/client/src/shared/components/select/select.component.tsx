import React, { useCallback } from "react";

type Props = {
  name?: string;
  value?: string;
  list: string[];
  onChange?: (value: string) => void;
};

export const SelectComponent: React.FC<Props> = ({
  name,
  value,
  list,
  onChange,
}) => {
  const $onChange = useCallback(
    (event) => onChange?.(list.find((option) => option === event.target.value)),
    [list, onChange],
  );

  return (
    <select name={name} value={value} onChange={$onChange}>
      {list.map((currentValue) => (
        <option key={currentValue} value={currentValue}>
          {currentValue}
        </option>
      ))}
    </select>
  );
};
