"use client";

import { useState } from "react";
import Joyride from "react-joyride";

export const ChatTutorial = () => {
  const [{ run, steps }, setState] = useState({
    run: true,
    steps: [
      {
        target: "body",
        content: <h2>Let&apos;s begin our journey!</h2>,
        locale: { skip: "SKIP" },
        placement: "center",
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

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={() => {}}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 9999,
        },
      }}
    />
  );
};
