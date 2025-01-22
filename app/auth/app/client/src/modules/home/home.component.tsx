import React from "react";
import { useAccount } from "shared/hooks";
import { RedirectComponent } from "shared/components";

export const HomeComponent: React.FC = () => {
  const { isLogged } = useAccount();

  if (isLogged === null) return <div>Loading...</div>;
  if (!isLogged) return <RedirectComponent to="/login" />;

  return (
    <div>
      <h1>Home</h1>
      <label>Welcome to OpenHotel Auth!</label>
    </div>
  );
};
