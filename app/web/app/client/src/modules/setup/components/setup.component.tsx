import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import { MainCardComponent } from "shared/components/main-card.component.tsx";
import { FooterComponent } from "shared/components/footer.component.tsx";
import { SetupStepsComponent } from "modules/setup/components/setup-steps.component.tsx";
import { SETUP_PATH, SETUP_STEPS } from "shared/consts/setup.consts.ts";
import {
  clearNextSteps,
  getLeafSteps,
  getReachableIndex,
  getVisibleSteps,
} from "shared/utils/setup.utils.ts";
import { SetupFormData } from "shared/types/setup.types.ts";
import { useTranslation } from "react-i18next";

export const SetupComponent: React.FC = () => {
  const navigate = useNavigate();
  const { "*": currentPath = "" } = useParams();
  const { t } = useTranslation();

  const [ready, setReady] = useState(!currentPath);
  const [setupData, setSetupData] = useState<Partial<SetupFormData>>({});
  const steps = useMemo(
    () => getVisibleSteps(SETUP_STEPS, setupData),
    [setupData],
  );

  const leafSteps = useMemo(
    () =>
      getLeafSteps(steps).map((leafStep, index) =>
        index === 0 ? { ...leafStep, path: "" } : leafStep,
      ),
    [steps],
  );

  const reachable = useMemo(
    () => getReachableIndex(leafSteps, setupData),
    [leafSteps, setupData],
  );

  const stepIndex = Math.max(
    0,
    leafSteps.findIndex(({ path }) => path === currentPath),
  );

  const onFinish = useCallback(
    async (data: SetupFormData) => {
      console.log(data);
      // await fetch("/api/setup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      navigate("/", { replace: true });
    },
    [navigate],
  );

  const goToStep = useCallback(
    (index: number) => {
      const leafStep = leafSteps[index];
      if (leafStep)
        navigate(leafStep.path ? `${SETUP_PATH}/${leafStep.path}` : SETUP_PATH);
    },
    [leafSteps, navigate],
  );

  const onSubmitStep = useCallback(
    (key: string, stepData: unknown) => {
      const next = { ...setupData, [key]: stepData };
      if (stepIndex === leafSteps.length - 1)
        return onFinish(next as SetupFormData);
      setSetupData(next);
      goToStep(stepIndex + 1);
    },
    [setupData, stepIndex, leafSteps, goToStep, onFinish],
  );

  const clearNextData = useCallback(
    () => setSetupData((data) => clearNextSteps(data, leafSteps, stepIndex)),
    [leafSteps, stepIndex],
  );

  useEffect(() => {
    if (ready) return;
    navigate(SETUP_PATH, { replace: true });
    setReady(true);
  }, []);

  const onBackStep = useCallback(() => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }, [stepIndex, goToStep]);

  return (
    <div className="flex flex-col gap-4">
      <MainCardComponent />
      <div className="border bg-(--box) setup-grip">
        <Routes>
          {leafSteps.map(
            ({ step: { key, render: StepRender }, path }, index) => (
              <Route
                key={path}
                index={!path}
                path={path || undefined}
                element={
                  StepRender ? (
                    <StepRender
                      setupData={
                        leafSteps.length === index + 1
                          ? (setupData as SetupFormData)
                          : undefined
                      }
                      onSubmit={(stepData) => onSubmitStep(key, stepData)}
                      defaultValues={(setupData as any)[key] ?? {}}
                      onBack={onBackStep}
                      onChange={(data) => {
                        setSetupData((setupData) => ({
                          ...setupData,
                          [key]: data,
                        }));
                        clearNextData();
                      }}
                    />
                  ) : null
                }
              />
            ),
          )}
          <Route path="*" element={<Navigate to={SETUP_PATH} replace />} />
        </Routes>
        <div className="p-card setup-grid-steps">
          <div className="title">{t("setup.steps.label")}</div>
          <SetupStepsComponent
            steps={steps}
            reachable={reachable}
            index={stepIndex}
            onClickStep={goToStep}
          />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};
