import { useAdmin, useApi } from "shared/hooks";
import React, { useCallback, useEffect, useState } from "react";

export const ActionsComponent = () => {
  const { getVersion } = useApi();
  const { update } = useAdmin();

  const [version, setVersion] = useState<string>(null);

  useEffect(() => {
    getVersion().then(setVersion);
  }, [getVersion]);

  const onUpdate = useCallback(() => {
    update().then(() => {
      setTimeout(() => location.reload(), 10_000);
    });
  }, [update]);

  return (
    <div>
      <h3>Actions</h3>
      <div>
        <p>{version}</p>
        <button onClick={onUpdate}>Update</button>
      </div>
    </div>
  );
};
