import React, { useEffect, useState } from "react";
import {
  definePlugin,
  ServerAPI,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ButtonItem,
  staticClasses,
} from "decky-frontend-lib";

type SetResp = { success: boolean; applied?: number; message?: string };
type StateResp = { percent: number };

function Content({ serverAPI }: { serverAPI: ServerAPI }) {
  const [percent, setPercent] = useState<number>(100);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await serverAPI.callPluginMethod<{}, StateResp>("get_state", {});
    if (res.success && res.result && typeof res.result.percent === "number") {
      setPercent(res.result.percent);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function apply(p: number) {
    setBusy(true);
    try {
      const res = await serverAPI.callPluginMethod<{ percent: number }, SetResp>(
        "set_mic_boost",
        { percent: p }
      );
      if (!res.success) {
        serverAPI.toaster.toast({
          title: "Mic Boost",
          body: res.result?.message ?? "Failed to apply mic boost.",
        });
      }
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    try {
      const res = await serverAPI.callPluginMethod<{}, { success: boolean }>("reset_mic_boost", {});
      if (!res.success) {
        serverAPI.toaster.toast({
          title: "Mic Boost",
          body: "Failed to reset mic boost.",
        });
        return;
      }
      setPercent(100);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PanelSection title="Mic Boost">
      <PanelSectionRow>
        <div className={staticClasses.Text} style={{ opacity: 0.8 }}>
          Boosting above 100% is digital gain and may cause clipping/noise.
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label={`Mic Boost: ${percent}%`}
          value={percent}
          min={100}
          max={500}
          step={10}
          disabled={busy}
          onChange={(v: number) => setPercent(v)}
          onChangeEnd={(v: number) => apply(v)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" disabled={busy} onClick={reset}>
          Reset to 100%
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin((serverAPI: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Mic Boost</div>,
    content: <Content serverAPI={serverAPI} />,
    icon: <div className={staticClasses.Icon}>🎙️</div>,
  };
});
