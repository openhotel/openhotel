import React, { useCallback, useMemo, useState } from "react";
import {
  ButtonComponent,
  InputComponent,
  SelectorComponent,
} from "@openhotel/web-components";
import { useFurniture } from "shared/hooks";
import { cn } from "shared/utils";
import { FurnitureLangItem } from "shared/types";
import styles from "./furniture-lang-form.module.scss";

const AVAILABLE_LANGUAGES = [
  { key: "en", value: "English (en)" },
  { key: "es", value: "Español (es)" },
  { key: "ca", value: "Català (ca)" },
];

type LangItemProps = {
  langKey: string;
  item: FurnitureLangItem;
  onChange: (
    langKey: string,
    field: keyof FurnitureLangItem,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (langKey: string) => () => void;
};

const FurnitureLangItemComponent: React.FC<LangItemProps> = ({
  langKey,
  item,
  onChange,
  onRemove,
}) => {
  const label = useMemo(() => {
    const found = AVAILABLE_LANGUAGES.find((l) => l.key === langKey);
    return found ? found.value : langKey;
  }, [langKey]);

  return (
    <div className={cn(styles.column, styles.item)}>
      <div className={styles.row}>
        <InputComponent placeholder="lang" value={label} disabled />
        <InputComponent
          placeholder="name"
          value={item.name}
          onChange={onChange(langKey, "name")}
        />
      </div>
      <InputComponent
        placeholder="description"
        value={item.description}
        onChange={onChange(langKey, "description")}
      />
      <ButtonComponent color="grey" onClick={onRemove(langKey)}>
        Remove
      </ButtonComponent>
    </div>
  );
};

export const FurnitureLangFormComponent: React.FC = () => {
  const { data, setLang } = useFurniture();
  const { lang } = data;

  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const usedKeys = useMemo(() => Object.keys(lang ?? {}), [lang]);

  const availableOptions = useMemo(
    () =>
      AVAILABLE_LANGUAGES.filter((l) => !usedKeys.includes(l.key)).map((l) => ({
        key: l.key,
        value: l.value,
      })),
    [usedKeys],
  );

  const $onAddLang = useCallback(() => {
    if (!selectedLang) return;
    if (usedKeys.includes(selectedLang)) return;

    setLang({
      ...lang,
      [selectedLang]: { name: "", description: "" },
    });
    setSelectedLang(null);
  }, [selectedLang, lang, setLang, usedKeys]);

  const $onRemoveLang = useCallback(
    (langKey: string) => () => {
      const updated = { ...lang };
      delete updated[langKey];
      setLang(updated);
    },
    [lang, setLang],
  );

  const $onChangeLangField = useCallback(
    (langKey: string, field: keyof FurnitureLangItem) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setLang({
          ...lang,
          [langKey]: {
            ...lang[langKey],
            [field]: event.target.value,
          },
        });
      },
    [lang, setLang],
  );

  return (
    <>
      <label>lang</label>
      <div className={styles.list}>
        {usedKeys.map((langKey) => (
          <FurnitureLangItemComponent
            key={langKey}
            langKey={langKey}
            item={lang[langKey]}
            onChange={$onChangeLangField}
            onRemove={$onRemoveLang}
          />
        ))}
        <div className={cn(styles.column, styles.item, styles.new)}>
          <div className={styles.row}>
            <SelectorComponent
              placeholder="language"
              defaultOption={selectedLang}
              options={availableOptions}
              onChange={(option) => setSelectedLang(option?.key ?? null)}
            />
            <ButtonComponent onClick={$onAddLang} disabled={!selectedLang}>
              Add
            </ButtonComponent>
          </div>
        </div>
      </div>
    </>
  );
};
