import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  SliderField,
  toaster,
} from "decky-frontend-lib";
import { useState } from "react";

const DEFAULT_PERCENT = 100;
const MIN_PERCENT = 100;
const MAX_PERCENT = 500;
const STEP = 10;

export default definePlugin((serverAPI) => {
  const [percent, setPercent] = useState(DEFAULT_PERCENT);

  const applyBoost = async (nextPercent: number) => {
    setPercent(nextPercent);
    const result = await serverAPI.callPluginMethod("set_mic_boost", {
      percent: nextPercent,
    });

    if (!result.success) {
      toaster.toast({
        title: "Mic Boost",
        body: result.result?.error ?? "Failed to set mic boost.",
      });
    }
  };

  const resetBoost = async () => {
    setPercent(DEFAULT_PERCENT);
    const result = await serverAPI.callPluginMethod("reset_mic_boost", {});

    if (!result.success) {
      toaster.toast({
        title: "Mic Boost",
        body: result.result?.error ?? "Failed to reset mic boost.",
      });
    }
  };

  return (
    <PanelSection title="Mic Boost">
      <PanelSectionRow>
        <SliderField
          label="Mic Boost"
          value={percent}
          min={MIN_PERCENT}
          max={MAX_PERCENT}
          step={STEP}
          valueSuffix="%"
          onChange={applyBoost}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={resetBoost}>Reset to Default</ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
});
