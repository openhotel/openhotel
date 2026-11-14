import React from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const LinkComponent: React.FC<Props> = ({ to, children, className }) => {
  return (
    <Link className={className} to={to + location.hash} children={children} />
  );
};
