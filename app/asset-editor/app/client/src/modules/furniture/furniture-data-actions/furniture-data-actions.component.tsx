import React, { useCallback, useMemo, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectorComponent,
} from "@openhotel/web-components";
import { useFurniture } from "shared/hooks";
import { cn } from "shared/utils";
import { FurnitureAction } from "shared/types";

//@ts-ignore
import styles from "./furniture-data-actions.module.scss";

type ActionItemProps = {
  action: FurnitureAction;
  onChangeField: (
    actionId: string,
    field: keyof FurnitureAction,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDefaultState: (
    actionId: string,
  ) => (option: { key: string } | null) => void;
  onRemove: (actionId: string) => () => void;
};

const FurnitureActionItemComponent: React.FC<ActionItemProps> = ({
  action,
  onChangeField,
  onChangeDefaultState,
  onRemove,
}) => {
  const stateOptions = useMemo(
    () => action.states.map((s) => ({ key: s, value: s })),
    [action.states],
  );

  return (
    <div className={cn(styles.column, styles.item)}>
      <div className={styles.row}>
        <InputComponent placeholder="id" value={action.id} disabled />
        <InputComponent
          placeholder="label"
          value={action.label}
          onChange={onChangeField(action.id, "label")}
        />
      </div>
      <div className={styles.row}>
        <InputComponent
          placeholder="states (comma separated)"
          value={action.states.join(", ")}
          onChange={onChangeField(action.id, "states")}
        />
        <SelectorComponent
          placeholder="defaultState"
          defaultOption={action.defaultState}
          options={stateOptions}
          onChange={onChangeDefaultState(action.id)}
          clearable={false}
        />
      </div>
      <ButtonComponent color="grey" onClick={onRemove(action.id)}>
        Remove
      </ButtonComponent>
    </div>
  );
};

export const FurnitureDataActionsComponent: React.FC = () => {
  const { data, setFurniture } = useFurniture();

  const { furniture } = data;

  const [newStatesInput, setNewStatesInput] = useState<string>("");

  const $onAddAction = useCallback(
    (formData) => {
      if (!formData.id) return;

      const states = (formData.states as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (states.length === 0) return;

      const defaultState = formData.defaultState?.trim() || states[0];

      const newAction: FurnitureAction = {
        id: formData.id.trim(),
        label: (formData.label as string)?.trim() || formData.id.trim(),
        states,
        defaultState,
      };

      setFurniture({
        ...furniture,
        actions: [...(furniture.actions ?? []), newAction],
      });
      setNewStatesInput("");
    },
    [setFurniture, furniture],
  );

  const $onRemoveAction = useCallback(
    (actionId: string) => () => {
      setFurniture({
        ...furniture,
        actions: furniture.actions.filter((action) => action.id !== actionId),
      });
    },
    [setFurniture, furniture],
  );

  const $onChangeActionField = useCallback(
    (actionId: string, field: keyof FurnitureAction) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFurniture({
          ...furniture,
          actions: furniture.actions.map((action) => {
            if (action.id !== actionId) return action;
            if (field === "states") {
              const states = value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              return {
                ...action,
                states,
                defaultState: states.includes(action.defaultState)
                  ? action.defaultState
                  : states[0] ?? "",
              };
            }
            return { ...action, [field]: value };
          }),
        });
      },
    [setFurniture, furniture],
  );

  const $onChangeDefaultState = useCallback(
    (actionId: string) => (option: { key: string } | null) => {
      setFurniture({
        ...furniture,
        actions: furniture.actions.map((action) =>
          action.id === actionId
            ? { ...action, defaultState: option?.key ?? action.states[0] ?? "" }
            : action,
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
          <FurnitureActionItemComponent
            key={action.id}
            action={action}
            onChangeField={$onChangeActionField}
            onChangeDefaultState={$onChangeDefaultState}
            onRemove={$onRemoveAction}
          />
        ))}
        <FormComponent
          onSubmit={$onAddAction}
          className={cn(styles.column, styles.item, styles.new)}
        >
          <div className={styles.row}>
            <InputComponent name="id" placeholder="id" />
            <InputComponent name="label" placeholder="label" />
          </div>
          <div className={styles.row}>
            <InputComponent
              name="states"
              placeholder="states (comma separated)"
              value={newStatesInput}
              onChange={(e) => setNewStatesInput(e.target.value)}
            />
            <InputComponent name="defaultState" placeholder="defaultState" />
          </div>
          <ButtonComponent>Add</ButtonComponent>
        </FormComponent>
      </div>
    </>
  );
};
