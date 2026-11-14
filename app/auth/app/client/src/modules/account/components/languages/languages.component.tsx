import React, { useCallback, useEffect, useMemo } from "react";
import { useLanguages, useUser } from "shared/hooks";
import {
  ButtonComponent,
  FormComponent,
  SelectorComponent,
} from "@openhotel/web-components";
import styles from "./languages.module.scss";
import { cn } from "shared/utils";

export const LanguagesComponent: React.FC = () => {
  const { user, update } = useUser();

  const { fetchLanguages, languages } = useLanguages();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const languageOptions = useMemo(
    () =>
      languages
        .filter((language) => !user.languages.includes(language.code))
        .map((language) => ({ key: language.code, value: language.name })),
    [languages, user],
  );

  const onSubmit = useCallback(
    async ({ language }) => {
      update({ languages: [...user.languages, language] });
    },
    [update, user],
  );

  const onDelete = useCallback(
    (language: string) => () => {
      update({
        languages: user.languages.filter(($language) => language !== $language),
      });
    },
    [update, user],
  );

  const userLanguages = useMemo(() => {
    return user.languages.map((code) => ({
      code,
      name: languages.find((lang) => lang.code === code)?.name,
    }));
  }, [user.languages, languages]);

  return (
    <div className={styles.content}>
      <label>Languages:</label>
      <div className={styles.list}>
        {userLanguages.map(({ code, name }, index) => (
          <div key={code} className={cn(styles.item, styles.nonForm)}>
            <label>{name}</label>
            {user.languages.length > 1 ? (
              <ButtonComponent color="grey" onClick={onDelete(code)}>
                Remove
              </ButtonComponent>
            ) : null}
          </div>
        ))}
        {languageOptions.length ? (
          <FormComponent onSubmit={onSubmit}>
            <div className={styles.item}>
              <SelectorComponent
                name="language"
                placeholder="language"
                options={languageOptions}
                clearable={false}
              />
              <ButtonComponent>Add</ButtonComponent>
            </div>
          </FormComponent>
        ) : null}
      </div>
    </div>
  );
};
