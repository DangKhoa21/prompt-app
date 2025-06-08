"use client";

import Joyride from "react-joyride";

export const ChatTutorial = ({ run }: { run: boolean }) => {
  const steps = [
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
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
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
