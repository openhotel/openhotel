import React from "react";
import { z, ZodObject } from "zod";
import type {
  MODE_SETUP_SCHEMA,
  SETUP_STEPS,
  WELCOME_SETUP_SCHEMA,
} from "shared/consts/setup.consts.ts";

export type SetupStepProps<StepData = any> = {
  defaultValues?: StepData;
  onSubmit: (data: StepData) => void;
  onChange?: (data: Partial<StepData>) => void;
  onBack?: () => void;
};

export type Step = {
  key: string;
  label: string;
  steps?: readonly Step[];
  render?: React.ComponentType<SetupStepProps>;
  when?: (data: any) => boolean;
  schema?: ZodObject;
};

export type LeafStep = {
  step: Step;
  path: string;
};

type LeafStepOf<S> = S extends { steps: readonly (infer C)[] }
  ? LeafStepOf<C>
  : S;

export type SetupData<T extends readonly Step[]> = {
  [
    S in LeafStepOf<T[number]> as S extends {
      schema: ZodObject;
      key: infer K extends string;
    }
      ? K
      : never
  ]: S extends { schema: infer Z extends ZodObject } ? z.infer<Z> : never;
};

export type SetupFormData = SetupData<typeof SETUP_STEPS>;

export type WelcomeStepForm = z.infer<typeof WELCOME_SETUP_SCHEMA>;
export type ModeStepForm = z.infer<typeof MODE_SETUP_SCHEMA>;
