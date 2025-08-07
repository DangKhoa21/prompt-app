"use client";

import { useTheme } from "next-themes";
import Joyride, { Step } from "react-joyride";

interface CustomJoyrideProps {
  run: boolean;
  steps: Step[];
  setRun: (val: boolean) => void;
}

export default function CustomJoyride({
  run,
  steps,
  setRun,
}: CustomJoyrideProps) {
  const { resolvedTheme } = useTheme();

  const defaultOptions = {
    arrowColor: "#fff",
    backgroundColor: "#fff",
    beaconSize: 36,
    overlayColor: "rgba(0, 0, 0, 0.7)",
    primaryColor: "#f04",
    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.7)",
    textColor: "#333",
    // width: undefined,
    zIndex: 100,
  };

  if (resolvedTheme === "dark") {
    defaultOptions.arrowColor = "#4e75df";
    defaultOptions.backgroundColor = "#4e75df";
    defaultOptions.primaryColor = "#203f93";
    defaultOptions.textColor = "#fff";
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          localStorage.setItem("hasSeenChatTutorial", "true");
          setRun(false);
        }
      }}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: defaultOptions,
      }}
    />
  );
}
