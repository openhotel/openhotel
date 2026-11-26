import React, { lazy } from "react";
import { z } from "zod";
import type { SetupStepProps, Step } from "shared/types/setup.types.ts";
import {
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "@shared/consts/account.consts.ts";

export const SETUP_PATH = "/setup";

const WelcomeStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/welcome-step.component.tsx").then(
    (m) => ({
      default: m.WelcomeStepComponent,
    }),
  ),
);

const ModeStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/mode-step.component.tsx").then(
    (m) => ({
      default: m.ModeStepComponent,
    }),
  ),
);

const AdminStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/admin-step.component.tsx").then(
    (m) => ({
      default: m.AdminStepComponent,
    }),
  ),
);

const EmailStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/email-step.component.tsx").then(
    (m) => ({
      default: m.EmailStepComponent,
    }),
  ),
);

const HotelStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/hotel-step.component.tsx").then(
    (m) => ({
      default: m.HotelStepComponent,
    }),
  ),
);

const ReviewStepComponent: React.ComponentType<SetupStepProps> = lazy(() =>
  import("modules/setup/components/steps/review-step.component.tsx").then(
    (m) => ({
      default: m.ReviewStepComponent,
    }),
  ),
);

const ManagedNetworkStepComponent: React.ComponentType<SetupStepProps> = lazy(
  () =>
    import("modules/setup/components/steps/managed/managed-network-step.component.tsx").then(
      (m) => ({
        default: m.ManagedNetworkStepComponent,
      }),
    ),
);

const ManagedLicenseStepComponent: React.ComponentType<SetupStepProps> = lazy(
  () =>
    import("modules/setup/components/steps/managed/managed-license-step.component.tsx").then(
      (m) => ({
        default: m.ManagedLicenseStepComponent,
      }),
    ),
);

const ManagedAdminStepComponent: React.ComponentType<SetupStepProps> = lazy(
  () =>
    import("modules/setup/components/steps/managed/managed-admin-step.component.tsx").then(
      (m) => ({
        default: m.ManagedAdminStepComponent,
      }),
    ),
);

export const WELCOME_SETUP_SCHEMA = z.object({
  code: z
    .string()
    .regex(
      /^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/i,
      "setup.steps.welcome.code.error",
    ),
});

export const MODE_SETUP_SCHEMA = z.object({
  mode: z.enum(
    ["managed", "standalone", "network"],
    "setup.steps.mode.mode.error",
  ),
});

export const ADMIN_SETUP_SCHEMA = z
  .object({
    username: z
      .string()
      .regex(USERNAME_REGEX, "setup.steps.admin.username.error"),
    email: z.email("setup.steps.admin.email.error"),
    password: z
      .string()
      .regex(PASSWORD_REGEX, "setup.steps.admin.password.error"),
    repeat_password: z.string(),
  })
  .refine((data) => data.password === data.repeat_password, {
    path: ["repeat_password"],
    message: "setup.steps.admin.repeat_password.error",
  });

export const EMAIL_SETUP_SCHEMA = z.object({
  server: z.string(),
  port: z.number(),
  security: z.string(),
  user: z.string(),
  password: z.string(),
  from: z.email(),
});

export const HOTEL_SETUP_SCHEMA = z.object({
  name: z.string(),
  description: z.string(),
  website: z.url(),
  client: z.url(),
});

export const MANAGED_NETWORK_SETUP_SCHEMA = z.object({
  network: z.url(),
});

export const MANAGED_LICENSE_SETUP_SCHEMA = z.object({
  license: z.string(),
});

export const MANAGED_ADMIN_SETUP_SCHEMA = z.object({
  accountId: z.string(),
});

export const MANAGED_SETUP_STEPS = [
  {
    key: "managed-network",
    label: "setup.steps.managed_network.label",
    render: ManagedNetworkStepComponent,
    schema: MANAGED_NETWORK_SETUP_SCHEMA,
  },
  {
    key: "managed-license",
    label: "setup.steps.managed_license.label",
    render: ManagedLicenseStepComponent,
    schema: MANAGED_LICENSE_SETUP_SCHEMA,
  },
  {
    key: "managed-admin",
    label: "setup.steps.managed_admin.label",
    render: ManagedAdminStepComponent,
    schema: MANAGED_ADMIN_SETUP_SCHEMA,
  },
] as const satisfies readonly Step[];

export const STANDALONE_SETUP_STEPS = [
  {
    key: "admin",
    label: "setup.steps.admin.label",
    render: AdminStepComponent,
    schema: ADMIN_SETUP_SCHEMA,
  },
  {
    key: "email",
    label: "setup.steps.email.label",
    render: EmailStepComponent,
    schema: EMAIL_SETUP_SCHEMA,
  },
] as const satisfies readonly Step[];

export const NETWORK_SETUP_STEPS = [
  {
    key: "",
    label: "",
  },
] as const satisfies readonly Step[];

export const SETUP_STEPS = [
  {
    key: "welcome",
    label: "setup.steps.welcome.label",
    render: WelcomeStepComponent,
    schema: WELCOME_SETUP_SCHEMA,
  },
  {
    key: "hotel",
    label: "setup.steps.hotel.label",
    render: HotelStepComponent,
    schema: HOTEL_SETUP_SCHEMA,
  },
  {
    key: "mode",
    label: "setup.steps.mode.label",
    render: ModeStepComponent,
    schema: MODE_SETUP_SCHEMA,
  },
  {
    key: "managed",
    label: "setup.steps.managed.label",
    when: (data) => data.mode?.mode === "managed",
    steps: MANAGED_SETUP_STEPS,
  },
  {
    key: "standalone",
    label: "setup.steps.standalone.label",
    when: (data) => data.mode?.mode === "standalone",
    steps: STANDALONE_SETUP_STEPS,
  },
  {
    key: "network",
    label: "setup.steps.network.label",
    when: (data) => data.mode?.mode === "network",
    steps: NETWORK_SETUP_STEPS,
  },
  {
    key: "review",
    label: "setup.steps.review.label",
    render: ReviewStepComponent,
  },
] as const satisfies readonly Step[];
