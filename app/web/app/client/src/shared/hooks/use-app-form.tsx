import { useCallback, useEffect, useRef } from "react";
import {
  DeepPartial,
  FieldError,
  FieldValues,
  get,
  Path,
  useForm,
  UseFormProps,
} from "react-hook-form";

type AppFormProps<T extends FieldValues> = UseFormProps<T> & {
  onChange?: (values: DeepPartial<T>) => void;
};

export const useAppForm = <T extends FieldValues>(
  { onChange, ...props }: AppFormProps<T>,
  t: (key: string) => string = (key) => key,
) => {
  const form = useForm<T>({ mode: "onChange", ...props });
  const { register, formState, watch } = form;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const { unsubscribe } = watch((values) =>
      onChangeRef.current?.(values as DeepPartial<T>),
    );
    return unsubscribe;
  }, [watch]);

  const field = useCallback(
    (name: Path<T>) => {
      const message = (get(formState.errors, name) as FieldError | undefined)
        ?.message;
      return {
        ...register(name),
        error: message ? t(message) : undefined,
      };
    },
    [register, formState, t],
  );

  return { ...form, field };
};
