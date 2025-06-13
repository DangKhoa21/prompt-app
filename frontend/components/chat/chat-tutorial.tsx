"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import Joyride from "react-joyride";

export const ChatTutorial = () => {
  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        target: "body",
        content: <h2>Let&apos;s begin our journey!</h2>,
        placement: "center" as const,
      },
      {
        target: ".multimodal-input",
        content: "Send messages and attach images, documents, or audio here.",
      },
      {
        target: ".chat-header",
        content: "This header lets you switch models or settings.",
      },
      {
        target: ".prompt-editor",
        content: "Edit your prompt here before chatting with the model.",
      },
    ],
  });

  const { resolvedTheme } = useTheme();

  const defaultOptions = {
    arrowColor: "#fff",
    backgroundColor: "#fff",
    beaconSize: 36,
    overlayColor: "rgba(0, 0, 0, 0.5)",
    primaryColor: "#f04",
    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
    textColor: "#333",
    // width: undefined,
    zIndex: 100,
  };

  if (resolvedTheme === "dark") {
    defaultOptions.arrowColor = "#010017";
    defaultOptions.backgroundColor = "#010017";
    defaultOptions.primaryColor = "#779cff";
    defaultOptions.textColor = "#fff";
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={() => {}}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: defaultOptions,
      }}
    />
  );
};
