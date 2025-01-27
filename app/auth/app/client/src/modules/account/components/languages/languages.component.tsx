import React, { FormEvent, useCallback, useEffect, useMemo } from "react";
import { useLanguages, useUser } from "shared/hooks";
import {
  ButtonComponent,
  FormComponent,
  SelectorComponent,
} from "@oh/components";

//@ts-ignore
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
        .filter((language) => !user.languages.includes(language))
        .map((language) => ({ key: language, value: language })),
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

  return (
    <div className={styles.content}>
      <label>Languages:</label>
      <div className={styles.list}>
        {user.languages.map((language, index) => (
          <div key={language} className={cn(styles.item, styles.nonForm)}>
            <label>{language}</label>
            {user.languages.length > 1 ? (
              <ButtonComponent color="grey" onClick={onDelete(language)}>
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
