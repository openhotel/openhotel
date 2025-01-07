import * as React from "react";

// @ts-ignore
import styles from "./file-input.module.scss";
import { cn } from "../../../utils";
import { useCallback, useId, useState } from "react";
import {
  BoxComponent,
  BoxProps,
  extractBoxProps,
  UploadIconComponent,
} from "../../../components";

type Props = Partial<BoxProps> &
  React.HTMLProps<HTMLInputElement> & {
    className?: string;
    onChange?: (files: File[]) => void;
  };

export const FileInputComponent: React.FC<Props> = ({
  className,
  placeholder,
  onChange,
  ...props
}) => {
  const id = useId();
  const [otherProps, boxProps] = extractBoxProps<Props>(props);
  const [files, setFiles] = useState<string[]>([]);

  const $onChange = useCallback(
    (event) => {
      const files = Array.from(event.target.files) as File[];
      setFiles(files.map((file: File) => file.name));
      onChange && onChange(files);
    },
    [onChange],
  );

  return (
    <BoxComponent {...boxProps} className={cn(styles.inputWrapper, className)}>
      <label htmlFor={id}>
        <UploadIconComponent />
        <span>Upload</span>
      </label>
      <input
        id={id}
        {...otherProps}
        className={cn(styles.input, className, {
          [styles.hasPlaceholder]: !!placeholder,
        })}
        type="file"
        onChange={$onChange}
      />
      <div className={styles.files}>
        {files.length ? files.join(", ") : "No file selected"}
      </div>
    </BoxComponent>
  );
};
