import React, { lazy } from "react";
import { z } from "zod";
import type { SetupStepProps, Step } from "shared/types/setup.types.ts";

const WelcomeStepComponent: React.ComponentType<SetupStepProps<any>> = lazy(
  () =>
    import("modules/setup/components/steps/welcome-step.component.tsx").then(
      (m) => ({
        default: m.WelcomeStepComponent,
      }),
    ),
);

const ModeStepComponent: React.ComponentType<SetupStepProps<any>> = lazy(() =>
  import("modules/setup/components/steps/mode-step.component.tsx").then(
    (m) => ({
      default: m.ModeStepComponent,
    }),
  ),
);

export const WELCOME_SETUP_SCHEMA = z.object({
  code: z
    .string()
    .length(11, "setup.welcome.code.length")
    .regex(
      /^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/i,
      "setup.welcome.code.format",
    ),
});

export const MODE_SETUP_SCHEMA = z.object({
  mode: z.enum(["managed", "standalone", "network"]),
});

export const SETUP_PATH = "/setup";

export const MANAGED_SETUP_STEPS = [
  {
    key: "managed_network",
    label: "setup.managed.network.label",
  },
  {
    key: "managed_license",
    label: "setup.managed.license.label",
  },
  {
    key: "managed_admin",
    label: "setup.managed.admin.label",
  },
  {
    key: "managed_hotel",
    label: "setup.managed.hotel.label",
  },
  {
    key: "managed_registration",
    label: "setup.managed.registration.label",
  },
] as const satisfies readonly Step[];

export const STANDALONE_SETUP_STEPS = [
  {
    key: "standalone_network",
    label: "setup.standalone.network.label",
  },
] as const satisfies readonly Step[];

export const NETWORK_SETUP_STEPS = [
  {
    key: "network",
    label: "setup.network.label",
  },
] as const satisfies readonly Step[];

export const SETUP_STEPS = [
  {
    key: "welcome",
    label: "setup.welcome.label",
    render: WelcomeStepComponent,
    schema: WELCOME_SETUP_SCHEMA,
  },
  {
    key: "mode",
    label: "setup.mode.label",
    render: ModeStepComponent,
    schema: MODE_SETUP_SCHEMA,
  },
  {
    key: "managed",
    label: "setup.managed.label",
    when: (data) => data.mode?.mode === "managed",
    steps: MANAGED_SETUP_STEPS,
  },
  {
    key: "standalone",
    label: "setup.standalone.label",
    when: (data) => data.mode?.mode === "standalone",
    steps: STANDALONE_SETUP_STEPS,
  },
  {
    key: "network",
    label: "setup.network.label",
    when: (data) => data.mode?.mode === "network",
    steps: NETWORK_SETUP_STEPS,
  },
] as const satisfies readonly Step[];
