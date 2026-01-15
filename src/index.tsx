import { definePlugin, call, toaster } from "@decky/api";
import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  SliderField,
} from "@decky/ui";
import { useEffect, useRef, useState } from "react";

const DEFAULT_PERCENT = 100;
const MIN_PERCENT = 100;
const MAX_PERCENT = 500;
const STEP = 10;

type StateResponse = { percent: number };
type ErrorResponse = { error: string };

function clampPercent(p: number): number {
  if (!Number.isFinite(p)) return DEFAULT_PERCENT;
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, Math.round(p)));
}

function MicBoostPanel() {
  const [percent, setPercent] = useState<number>(DEFAULT_PERCENT);
  const [busy, setBusy] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    (async () => {
      try {
        const res = await call<[], StateResponse>("get_state");
        if (isMounted.current && typeof res?.percent === "number") {
          setPercent(clampPercent(res.percent));
        }
      } catch (e: any) {
        // Non-fatal: just stick to default
        toaster.toast({
          title: "Mic Boost",
          body: `Failed to load state: ${String(e?.message ?? e)}`,
          critical: false,
        });
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const applyBoost = async (nextPercent: number) => {
    const p = clampPercent(nextPercent);
    setPercent(p);

    setBusy(true);
    try {
      const res = await call<[percent: number], StateResponse | ErrorResponse>(
        "set_mic_boost",
        p
      );

      if ("error" in res) {
        toaster.toast({ title: "Mic Boost", body: res.error, critical: true });
      }
    } catch (e: any) {
      toaster.toast({
        title: "Mic Boost",
        body: `Failed to apply: ${String(e?.message ?? e)}`,
        critical: true,
      });
    } finally {
      if (isMounted.current) setBusy(false);
    }
  };

  const resetBoost = async () => {
    setBusy(true);
    try {
      const res = await call<[], StateResponse | ErrorResponse>("reset_mic_boost");
      if ("error" in res) {
        toaster.toast({ title: "Mic Boost", body: res.error, critical: true });
        return;
      }
      if (isMounted.current) setPercent(DEFAULT_PERCENT);
    } catch (e: any) {
      toaster.toast({
        title: "Mic Boost",
        body: `Failed to reset: ${String(e?.message ?? e)}`,
        critical: true,
      });
    } finally {
      if (isMounted.current) setBusy(false);
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
          disabled={busy}
          showValue={true}
          valueSuffix="%"
          onChange={(val: number) => setPercent(clampPercent(val))}
          onChangeComplete={(val: number) => void applyBoost(val)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div>Current: {percent}%</div>
      </PanelSectionRow>

      <PanelSectionRow>
        <div>Boosting microphone input above 100% may cause clipping or noise.</div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem disabled={busy} onClick={() => void resetBoost()}>
          Reset to Default
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  title: "Mic Boost",
  content: <MicBoostPanel />,
  icon: <span style={{ fontSize: 18 }}>🎤</span>,
}));
