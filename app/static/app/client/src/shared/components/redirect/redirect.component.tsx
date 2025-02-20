import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  to: string;
};

export const RedirectComponent: React.FC<Props> = ({ to }) => {
  return <Navigate replace to={to + location.hash} />;
};
