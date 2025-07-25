"use client";

import CustomJoyride from "@/components/custom-joyride";

interface ChatTutorialProps {
  run: boolean;
  setRun: (val: boolean) => void;
}

export const ChatTutorial = ({ run, setRun }: ChatTutorialProps) => {
  const steps = [
    {
      target: "body",
      content: <h2>Let&apos;s begin our journey!</h2>,
      placement: "center" as const,
    },
    {
      target: ".multimodal-input",
      content: "Send messages here.",
    },
    {
      target: ".chat-header",
      content:
        "This header lets you switch models or settings, navigate between pages.",
    },
    {
      target: ".prompt-generator",
      content:
        "This is our prompt generator to help you get your desire prompt",
    },
    {
      target: ".new-ai-prompt",
      content: "Create new prompt for your purpose with the help of AI",
    },
    {
      target: ".marketplace",
      content: "Search for existing prompts which is shared by the community",
    },
    {
      target: ".techniques-handbook",
      content: "Or you can use our handbook to use quick prompt techniques",
    },
  ];

  return <CustomJoyride run={run} steps={steps} setRun={setRun} />;
};
