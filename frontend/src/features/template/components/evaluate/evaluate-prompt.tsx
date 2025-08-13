"use client";

import { Markdown } from "@/components/markdown";
import RenderConfigInput from "@/components/prompt/generator-items/generator-config-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BetterTooltip } from "@/components/ui/tooltip";
import { useTemplate } from "@/context/template-context";
import {
  ConfigType,
  useEvaluatePrompt,
  useGeneratePromptResult,
  useUpdatePromptResult,
} from "@/features/template";
import { cn } from "@/lib/utils";
import {
  ConfigMapping,
  deserializeResultConfigData,
  serializeMultipleResultsConfigData,
} from "@/lib/utils/utils.details";
import {
  fillPromptTemplate,
  validateFilledConfigs,
} from "@/lib/utils/utils.generate-prompt";
import { Check, Copy, Play } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EvaluationResult {
  id: string;
  configValues: ConfigMapping[];
  // prompt: string;
  result: string;
  timestamp: string;
  selected?: boolean;
}

interface EvaluationPromptProp {
  setActiveTab: Dispatch<SetStateAction<string>>;
  improvementSuggestions: string;
  setImprovementSuggestions: Dispatch<SetStateAction<string>>;
  setIsImprove: Dispatch<SetStateAction<boolean>>;
}

export function EvaluatePrompt({
  setActiveTab,
  improvementSuggestions,
  setImprovementSuggestions,
  setIsImprove,
}: EvaluationPromptProp) {
  const { template } = useTemplate();

  const [loadingStates, setLoadingStates] = useState({
    evaluating: false,
    suggesting: false,
  });
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [openPreview, setOpenPreview] = useState(true);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {},
  );
  const [arrayValues, setArrayValues] = useState<
    Record<string, { id: string; values: string[] }[]>
  >({});
  const [evaluationResults, setEvaluationResults] = useState<
    EvaluationResult[]
  >([]);
  const [isFilled, setIsFilled] = useState({
    isValid: false,
    unfilledConfigs: [""],
    filledCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (!template.exampleResult) return;
    const deserialized = deserializeResultConfigData(template.exampleResult);

    if (!deserialized) return;

    // Step 2: Generate config values
    const entries: Record<string, ConfigMapping[]> = {};
    deserialized.forEach((result, index) => {
      const entry: ConfigMapping[] = [];

      Object.entries(result.selectedValues).forEach(([key, value]) => {
        entry.push({ label: key, type: ConfigType.DROPDOWN, value });
      });

      Object.entries(result.textareaValues).forEach(([key, value]) => {
        entry.push({ label: key, type: ConfigType.TEXTAREA, value });
      });

      Object.entries(result.arrayValues).forEach(([key, array]) => {
        array.forEach((item, arrayIndex) => {
          entry.push({
            label: `${key} ${arrayIndex + 1}`,
            type: ConfigType.ARRAY,
            value: item.values.join(", "),
          });
        });
      });

      entries[index] = entry;
    });

    // Step 3: Final result only runs once
    const results = deserialized.map((result, index) => ({
      id: result.promptId,
      configValues: entries[index],
      result: result.exampleResult,
      timestamp: new Date().toISOString(),
      selected: true,
    }));

    setEvaluationResults(results);
  }, [template.exampleResult]);

  const promptResultsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const suggestImprovePromptRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: mutateGenerateResult } = useGeneratePromptResult();
  const { mutateAsync: mutateEvaluateTemplate } = useEvaluatePrompt(
    setImprovementSuggestions,
  );
  const { mutateAsync: mutateUpdatePromptResult } = useUpdatePromptResult();

  // For update Prompt Preview
  useEffect(() => {
    const handlePreviewPrompt = () => {
      const configs = template.configs;
      const prompt = fillPromptTemplate({
        template: template.stringTemplate,
        configs,
        selectedValues,
        textareaValues,
        arrayValues,
      });

      setPreviewPrompt(prompt);
    };

    handlePreviewPrompt();
  }, [
    arrayValues,
    selectedValues,
    template.configs,
    template.stringTemplate,
    textareaValues,
  ]);

  // Check filled configs
  useEffect(() => {
    if (!template) return;

    setIsFilled(
      validateFilledConfigs(
        template.configs,
        selectedValues,
        textareaValues,
        arrayValues,
      ),
    );
  }, [arrayValues, template, selectedValues, textareaValues]);

  // Scroll to the improve suggestion if have
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (suggestImprovePromptRef && suggestImprovePromptRef.current) {
  //       suggestImprovePromptRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       });
  //     }
  //   }, 300);
  //
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // });

  const handleGenerateResult = async () => {
    setLoadingStates((prev) => ({ ...prev, evaluating: true }));
    const FALLBACK_CONFIG = "Not selected";

    const configValues: ConfigMapping[] = [];
    template.configs.forEach((config) => {
      if (
        config.type === ConfigType.DROPDOWN ||
        config.type === ConfigType.COMBOBOX
      ) {
        configValues.push({
          label: config.label,
          type: config.type,
          value: selectedValues[config.label] ?? FALLBACK_CONFIG,
        });
      } else if (config.type === ConfigType.TEXTAREA) {
        configValues.push({
          label: config.label,
          type: config.type,
          value: textareaValues[config.label] ?? FALLBACK_CONFIG,
        });
      } else if (config.type === ConfigType.ARRAY) {
        configValues.push({
          label: config.label,
          type: config.type,
          value:
            arrayValues[config.label]
              .map((item, index) =>
                item.values
                  .map(
                    (value, labelIndex) =>
                      `${config.values[labelIndex].value} ${index + 1}: ${value}`,
                  )
                  .join("\n"),
              )
              .join("\n\n") ?? FALLBACK_CONFIG,
        });
      }
    });

    try {
      const result = await mutateGenerateResult(previewPrompt);

      const newResult: EvaluationResult = {
        id: Date.now().toString(),
        configValues,
        result,
        timestamp: new Date().toISOString(),
      };

      setEvaluationResults([...evaluationResults, newResult]);
      setLoadingStates((prev) => ({ ...prev, evaluating: false }));
      setTimeout(() => {
        promptResultsRef.current[newResult.id]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch (e) {
      toast.error("Failed to generate result");
      console.error("Generate prompt result error: ", e);
      setLoadingStates((prev) => ({ ...prev, evaluating: false }));
    }
  };

  const handleSelectResult = (resultId: string) => {
    if (
      evaluationResults.filter((result) => {
        return result.selected;
      }).length >= 3
    ) {
      toast.error(
        "You can only get max of 3 example results, please remove some to add new!",
      );
      return;
    }

    const updatedResults = evaluationResults.map((result) => ({
      ...result,
      selected: result.id === resultId ? !result.selected : result.selected,
    }));
    setEvaluationResults(updatedResults);

    const serializedData = serializeMultipleResultsConfigData({
      promptId: template.id,
      results: evaluationResults
        .filter((result) => {
          if (result.id === resultId) return !result.selected;
          return result.selected;
        })
        .map((result) => ({
          exampleResult: result.result,
          configs: result.configValues,
        })),
    });

    const updatePromptResultPromise = mutateUpdatePromptResult({
      id: template.id,
      data: serializedData,
    });

    toast.promise(updatePromptResultPromise, {
      loading: "Updating prompt result template...",
      success: "Updating prompt result template successfully",
      error: (e) => {
        console.error(e);
        return "Failed to update prompt result";
      },
    });
  };

  const handleCopyResult = (result: string) => {
    navigator.clipboard.writeText(result);
    toast.success("Result copied to clipboard");
  };

  const handleSuggestImprovements = async () => {
    setLoadingStates((prev) => ({ ...prev, suggesting: true }));
    setImprovementSuggestions("");

    await mutateEvaluateTemplate(template.stringTemplate);

    setLoadingStates((prev) => ({ ...prev, suggesting: false }));
  };

  return (
    <div className="flex flex-col w-full gap-2 items-center">
      <div className="flex-1 w-full grid py-2 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-semibold flex justify-between">
                <div>Configuration Values</div>
                <BetterTooltip
                  content={
                    !isFilled.isValid
                      ? `Unfilled required config(s): ${isFilled.unfilledConfigs
                          .map((configName) => `${configName}`)
                          .join(", ")}`
                      : "All required configs are filled"
                  }
                >
                  <div
                    className={cn(
                      !isFilled.isValid ? "text-red-500" : "text-green-500",
                    )}
                  >
                    Configs status: {isFilled.filledCount}/{isFilled.totalCount}
                  </div>
                </BetterTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.configs?.map((config, i) => (
                <RenderConfigInput
                  key={`config-${i}`}
                  config={config}
                  isFilled={isFilled}
                  selectedValues={selectedValues}
                  textareaValues={textareaValues}
                  arrayValues={arrayValues}
                  setSelectedValues={setSelectedValues}
                  setTextareaValues={setTextareaValues}
                  setArrayValues={setArrayValues}
                />
              ))}
            </CardContent>
            <CardFooter className="flex w-full gap-2">
              <Button
                className="flex-1"
                onClick={handleGenerateResult}
                disabled={loadingStates.evaluating || !isFilled.isValid}
              >
                {loadingStates.evaluating ? (
                  <>Running...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Evaluation
                  </>
                )}
              </Button>
              <BetterTooltip content={"Not available right now!"}>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSuggestImprovements}
                  disabled={loadingStates.suggesting}
                  // disabled={true}
                >
                  {loadingStates.suggesting ? (
                    <>Analyzing...</>
                  ) : (
                    <>Analyze Prompt</>
                  )}
                </Button>
              </BetterTooltip>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4 h-fit md:sticky md:top-28">
          <Card>
            <CardHeader
              className="group cursor-pointer hover:bg-accent"
              onClick={() => setOpenPreview(!openPreview)}
            >
              <CardTitle className="text-md font-semibold flex justify-between">
                <div>Preview</div>
                {!openPreview ? (
                  <div className="italic text-sm font-thin">Click to view</div>
                ) : (
                  <div className="italic text-sm font-thin">Click to hide</div>
                )}
              </CardTitle>
            </CardHeader>
            {openPreview && (
              <CardContent>
                <div className="p-4 rounded-md border whitespace-pre-wrap">
                  {previewPrompt}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {improvementSuggestions && (
        <Card ref={suggestImprovePromptRef}>
          <CardHeader>
            <CardTitle className="text-md font-semibold">
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-md border">
              <Markdown>{improvementSuggestions}</Markdown>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              onClick={() => {
                setActiveTab("edit");
                setIsImprove(true);
              }}
            >
              Apply improvement
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="flex-1 w-full">
        <CardHeader>
          <CardTitle className="text-md font-semibold">
            Evaluation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
          {evaluationResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No evaluations yet. Run the prompt with different configurations
              to see results.
            </p>
          ) : (
            evaluationResults.map((result) => (
              <Card
                key={result.id}
                ref={(el) => {
                  promptResultsRef.current[result.id] = el;
                }}
                className={`border ${result.selected ? "border-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <BetterTooltip content="Copy to clipboard">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyResult(result.result)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </BetterTooltip>
                      <BetterTooltip content="Update example result">
                        <Button
                          variant={result.selected ? "default" : "ghost"}
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleSelectResult(result.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </BetterTooltip>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2 mb-2">
                    <p className="font-medium">Configuration:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {result.configValues.map(({ label, type, value }) => {
                        const key = `${label}-${type}`;
                        return (
                          <div key={key} className="flex">
                            <span className="font-medium mr-1">{key}:</span>
                            <span className="overflow-auto whitespace-pre-wrap">
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <Markdown>{result.result}</Markdown>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
