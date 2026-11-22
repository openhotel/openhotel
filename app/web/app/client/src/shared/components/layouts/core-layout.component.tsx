import React from "react";
import { Outlet } from "react-router";

export const CoreLayoutComponent: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-page mx-auto">
        <Outlet />
      </div>
    </div>
  );
};
