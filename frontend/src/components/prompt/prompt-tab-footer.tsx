import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarFooter } from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { usePrompt } from "@/context/prompt-context";
import { ConfigType, useCreatePromptTemplate } from "@/features/template";
import { promptWithConfigGenSchema } from "@/lib/schema";
import { fillPromptTemplate } from "@/lib/utils/utils.generate-prompt";
import {
  PromptWithConfigs,
  PromptWithConfigsCreation,
} from "@/services/prompt/interface";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";

import { GeneratorMode } from "./enum-generator-mode";
import {
  ArrayConfigInputState,
  ConfigInputState,
  PromptFillState,
} from "./hooks/usePromptConfigState";
import { appURL } from "@/config/url.config";
import { TechWithLink } from "./tabs";

interface PromptTabFooterProps {
  mode: GeneratorMode;
  promptId: string;
  idea: string;
  data: PromptWithConfigs | undefined;
  selectedValues: ConfigInputState;
  textareaValues: ConfigInputState;
  arrayValues: ArrayConfigInputState;
  isFilled: PromptFillState;
  selectedTechnique: TechWithLink | null;
}

export default function PromptTabFooter({
  mode,
  idea,
  data,
  selectedValues,
  textareaValues,
  arrayValues,
  isFilled,
  selectedTechnique,
}: PromptTabFooterProps) {
  const { setPrompt } = usePrompt();
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreatePromptTemplate(false);

  const idRef = useRef<string>(v7());

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

  const { submit, isLoading, stop } = useObject({
    id: idRef.current,
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
              values: config.values.map((value) => {
                return {
                  ...value,
                  id: v7(),
                };
              }),
              info: config.info,
            };
          }),
        };

        queryClient.setQueryData(["prompt", idRef.current], newPrompt);
        router.push(`${appURL.chat}/?promptId=${idRef.current}`);

        const template: PromptWithConfigsCreation = {
          id: idRef.current,
          title: newPrompt.title,
          description: newPrompt.description,
          stringTemplate: newPrompt.stringTemplate,
          configs: newPrompt.configs,
        };

        const createPromptTemplatePromise = mutateAsync(template);

        toast.promise(createPromptTemplatePromise, {
          // loading: "Creating prompt template...",
          // success: "Creating prompt template successfully",
          error: (e) => {
            console.error(e);
            return "Failed to create new prompt template";
          },
        });
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
      <SidebarFooter>
        {mode === GeneratorMode.NEW_AI ? (
          <div className="md:p-2">
            {isLoading ? (
              <Button
                className="w-full bg-muted-foreground hover:bg-muted-foreground"
                onClick={() => stop()}
              >
                Stop
              </Button>
            ) : (
              <Button
                disabled={idea.trim().length < 20}
                onClick={() => {
                  submit({ prompt: idea });
                  const id = v7();
                  idRef.current = id;
                }}
                className="w-full"
              >
                Create
              </Button>
            )}
          </div>
        ) : mode === GeneratorMode.MARKETPLACE && data && data.id !== "1" ? (
          <>
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
            <div className="flex justify-around gap-4 pt-2 md:p-2">
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
          </>
        ) : mode === GeneratorMode.TECHNIQUE &&
          selectedTechnique !== null &&
          selectedTechnique.link !== "" ? (
          <div className="md:p-2">
            <Button
              onClick={() => {
                router.replace(`${selectedTechnique.link}`);
              }}
              className="w-full"
            >
              Use This Template
            </Button>
          </div>
        ) : null}
      </SidebarFooter>
    </>
  );
}
