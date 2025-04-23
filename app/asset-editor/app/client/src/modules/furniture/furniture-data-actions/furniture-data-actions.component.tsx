import React, { useCallback, useMemo, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectorComponent,
} from "@openhotel/components";
import { FurnitureActionType } from "shared/enums";
import { useFurniture } from "shared/hooks";
import { cn } from "shared/utils";

//@ts-ignore
import styles from "./furniture-data-actions.module.scss";

export const FurnitureDataActionsComponent: React.FC = () => {
  const { data, setFurniture } = useFurniture();

  const { furniture } = data;

  const [actionSelection, setActionSelection] =
    useState<FurnitureActionType>(null);

  const currentActions = useMemo(
    () => furniture.actions.map((action) => action.type),
    [furniture],
  );
  const actions = useMemo(() => Object.values(FurnitureActionType), []);
  const actionsOptions = useMemo(
    () =>
      actions
        .filter(($action) => !currentActions.includes($action))
        .map(($direction) => ({
          key: $direction,
          value: $direction,
        })),
    [actions, currentActions],
  );

  const $onAddAction = useCallback(
    (data) => {
      if (!data.type) return;

      setFurniture({
        ...furniture,
        actions: [
          ...(furniture.actions ?? []),
          {
            type: data.type,
            meta: data.meta,
          },
        ],
      });
      setActionSelection(null);
    },
    [setFurniture, setActionSelection, furniture, actionSelection],
  );
  const $onRemoveAction = useCallback(
    (actionType: FurnitureActionType) => () => {
      setFurniture({
        ...furniture,
        actions: furniture.actions.filter(
          (action) => action.type !== actionType,
        ),
      });
    },
    [setFurniture, furniture],
  );

  return (
    <>
      <label>actions</label>
      <div className={styles.list}>
        {furniture?.actions?.map((action) => (
          <div key={action.type} className={cn(styles.item, styles.row)}>
            <InputComponent placeholder="type" value={action.type} disabled />
            <InputComponent placeholder="meta" value={action.meta} disabled />
            <ButtonComponent
              color="grey"
              onClick={$onRemoveAction(action.type)}
            >
              Remove
            </ButtonComponent>
          </div>
        ))}
        {actionsOptions?.length ? (
          <FormComponent
            onSubmit={$onAddAction}
            className={cn(styles.column, styles.item, styles.new)}
          >
            <div className={styles.row}>
              <SelectorComponent
                name="type"
                placeholder="type"
                options={actionsOptions}
                defaultOption={actionSelection}
                onChange={(option) => setActionSelection(option?.key ?? null)}
                clearable={false}
              />
              <InputComponent name="meta" placeholder="meta" />
              <ButtonComponent>Add</ButtonComponent>
            </div>
          </FormComponent>
        ) : null}
      </div>
    </>
  );
};
