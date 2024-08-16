import React from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  children: React.ReactNode;
};

export const LinkComponent: React.FC<Props> = ({ to, children }) => {
  return <Link to={to + location.hash} children={children} />;
};
