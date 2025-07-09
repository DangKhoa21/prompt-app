import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarFooter } from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { usePrompt } from "@/context/prompt-context";
import { ConfigType } from "@/features/template";
import { promptWithConfigGenSchema } from "@/lib/schema";
import { fillPromptTemplate } from "@/lib/utils/utils.generate-prompt";
import { PromptWithConfigs } from "@/services/prompt/interface";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";

import { GeneratorMode } from "./enum-generator-mode";
import {
  ArrayConfigInputState,
  ConfigInputState,
  PromptFillState,
} from "./hooks/usePromptConfigState";

interface PromptTabFooterProps {
  mode: GeneratorMode;
  promptId: string;
  idea: string;
  data: PromptWithConfigs | undefined;
  selectedValues: ConfigInputState;
  textareaValues: ConfigInputState;
  arrayValues: ArrayConfigInputState;
  isFilled: PromptFillState;
}

export default function PromptTabFooter({
  mode,
  idea,
  data,
  selectedValues,
  textareaValues,
  arrayValues,
  isFilled,
}: PromptTabFooterProps) {
  const { setPrompt } = usePrompt();

  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // -- Handlers --
  const handlePrompt = useCallback(
    (isSending: boolean) => {
      if (!data) return;
      const prompt = fillPromptTemplate({
        template: data.stringTemplate,
        configs: data.configs,
        selectedValues,
        textareaValues,
        arrayValues,
      });

      setPrompt({ id: data.id, value: prompt, isSending });
    },
    [data, selectedValues, textareaValues, arrayValues, setPrompt],
  );

  const newPromptId = v7();

  const { submit, isLoading, stop } = useObject({
    id: newPromptId,
    api: `${SERVER_URL}/${VERSION_PREFIX}/prompts/generate-template`,
    schema: promptWithConfigGenSchema,
    headers: { Authorization: "Bearer " + token },
    onFinish({ object, error }) {
      if (object) {
        const newPrompt = {
          title: object.title,
          description: object.description,
          stringTemplate: object.stringTemplate,
          systemInstruction: object.systemInstruction,
          configs: object.configs.map((config) => {
            const configId = v7();

            return {
              ...config,
              type: config.type as ConfigType,
              id: configId,
              promptId: newPromptId,
              values: config.values.map((value) => {
                return {
                  ...value,
                  id: v7(),
                  promptConfigId: configId,
                };
              }),
            };
          }),
        };

        queryClient.setQueryData(["prompt", newPromptId], newPrompt);
        router.push(`?promptId=${newPromptId}`);
      }

      // error, undefined if schema validation succeeds:
      if (error) {
        console.error("Schema validation error:", error);
      }
    },
    onError: (e) => {
      try {
        const err = JSON.parse(e.message);
        toast.error(err.message);
      } catch {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  return (
    <>
      {mode === GeneratorMode.NEW_AI && (
        <SidebarFooter>
          {isLoading ? (
            <Button
              className="bg-muted-foreground hover:bg-muted-foreground"
              onClick={() => stop()}
            >
              Stop
            </Button>
          ) : (
            <Button
              disabled={idea.trim().length < 20}
              onClick={() => submit({ prompt: idea })}
              className=""
            >
              Create new Prompt
            </Button>
          )}
        </SidebarFooter>
      )}

      {mode === GeneratorMode.MARKETPLACE && data && data.id !== "1" && (
        <SidebarFooter>
          <BetterTooltip
            content={`Unfilled required config(s): ${isFilled.unfilledConfigs.join(
              ", ",
            )}`}
          >
            <div className="flex flex-col gap-1 px-2">
              <Progress
                value={(isFilled.filledCount / isFilled.totalCount) * 100}
                className="w-full h-2 mt-2 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {isFilled.filledCount} / {isFilled.totalCount} fields filled
              </p>
            </div>
          </BetterTooltip>
          <div className="flex justify-around gap-4 p-2">
            <Button
              className="w-1/2"
              disabled={!isFilled.isValid}
              onClick={() => handlePrompt(false)}
            >
              Generate
            </Button>
            <Button
              className="w-1/2"
              disabled={!isFilled.isValid}
              onClick={() => handlePrompt(true)}
            >
              Send
            </Button>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}
