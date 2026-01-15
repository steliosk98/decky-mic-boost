import { VFC, useState, useEffect } from "react";
import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  SliderField,
  staticClasses,
} from "decky-frontend-lib";
import { FaMicrophone } from "react-icons/fa";
  
  const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }: { serverAPI: ServerAPI }) => {
    const [micVolume, setMicVolume] = useState<number>(100);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    // Load current volume on mount
    useEffect(() => {
      loadCurrentVolume();
    }, []);
  
    const loadCurrentVolume = async () => {
      try {
        const result = await serverAPI.callPluginMethod<{}, number>(
          "get_mic_volume",
          {}
        );
        if (result.success) {
          setMicVolume(result.result);
        }
      } catch (error) {
        console.error("Error loading mic volume:", error);
      }
    };
  
    const handleVolumeChange = async (value: number) => {
      setMicVolume(value);
      setIsLoading(true);
      
      try {
        await serverAPI.callPluginMethod("set_mic_volume", {
          volume: value,
        });
      } catch (error) {
        console.error("Error setting mic volume:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleReset = async () => {
      setIsLoading(true);
      try {
        const result = await serverAPI.callPluginMethod<{}, { success: boolean; volume: number }>(
          "reset_mic_volume",
          {}
        );
        if (result.success) {
          setMicVolume(result.result.volume);
        }
      } catch (error) {
        console.error("Error resetting mic volume:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <PanelSection title="Microphone Boost">
        <PanelSectionRow>
          <SliderField
            label="Mic Volume"
            value={micVolume}
            min={100}
            max={500}
            step={10}
            onChange={handleVolumeChange}
            disabled={isLoading}
            notchCount={41}
            notchLabels={[
              { notchIndex: 0, label: "100%", value: 100 },
              { notchIndex: 10, label: "200%", value: 200 },
              { notchIndex: 20, label: "300%", value: 300 },
              { notchIndex: 30, label: "400%", value: 400 },
              { notchIndex: 40, label: "500%", value: 500 },
            ]}
            bottomSeparator="none"
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ fontSize: "14px", color: "#dcdedf", marginBottom: "10px" }}>
            Current: {micVolume}%
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset to Default (100%)
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    );
  };
  
  export default definePlugin((serverApi: ServerAPI) => {
    return {
      title: <div className={staticClasses.Title}>Mic Boost</div>,
      content: <Content serverAPI={serverApi} />,
      icon: <FaMicrophone />,
      onDismount() {
        // Cleanup if needed
      },
    };
  });