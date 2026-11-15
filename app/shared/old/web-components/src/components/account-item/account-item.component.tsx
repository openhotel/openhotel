import * as React from "react";

// @ts-ignore
import styles from "./account-item.module.scss";
import { cn } from "../../utils";

type Props = {
  className?: string;
  selected?: boolean;
  icon?: React.ReactNode;

  username?: string;
} & React.HTMLProps<HTMLDivElement>;

export const AccountItemComponent: React.FC<Props> = ({
  className,
  selected,
  icon,
  children,
  username,
  ...props
}) => {
  return (
    <div
      className={cn(styles.accountItem, className, {
        [styles.selected]: Boolean(selected),
      })}
      {...props}
    >
      <span>{username}</span>
    </div>
  );
};

// <div style={{marginTop: "auto", display: "flex"}}>
//   <div
//     style={{
//       height: "3rem",
//       width: "3rem",
//       content: "",
//       backgroundColor: "red",
//       borderRadius: "3rem",
//     }}
//   />
//   <label>pagoru</label>
// </div>
