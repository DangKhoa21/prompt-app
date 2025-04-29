"use client";

import { Markdown } from "@/components/markdown";
import { ArrayConfig } from "@/components/prompt/generator-items/array-config";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/context/template-context";
import {
  useEvaluatePrompt,
  useGeneratePromptResult,
  useUpdatePromptResult,
} from "@/features/template";
import { cn, serializeResultConfigData } from "@/lib/utils";
import { Check, Copy, FileQuestion, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EvaluationResult {
  id: string;
  configValues: Record<string, string>;
  prompt: string;
  result: string;
  timestamp: string;
  selected?: boolean;
}

export function EvaluatePrompt() {
  const { template } = useTemplate();

  const [loadingStates, setLoadingStates] = useState({
    evaluating: false,
    suggesting: false,
  });
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [openPreview, setOpenPreview] = useState(true);
  const [improvementSuggestions, setImprovementSuggestions] = useState("");
  const [noRemainingConfigs, setNoRemainingConfigs] = useState(0);
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
  const promptResultsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const suggestImprovePromptRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: mutateGenerateResult } = useGeneratePromptResult();
  const { mutateAsync: mutateEvaluateTemplate } = useEvaluatePrompt(
    setImprovementSuggestions,
  );
  const { mutateAsync: mutateUpdatePromptResult } = useUpdatePromptResult();

  const handleSelectChange = (configLabel: string, value: string) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const handleCreateOption = (configLabel: string, inputValue: string) => {
    const newOption = {
      value: inputValue,
    };

    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: newOption.value,
    }));
  };

  const handleTextareaChange = (configLabel: string, value: string) => {
    setTextareaValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  // For update Prompt Preview
  useEffect(() => {
    const handlePreviewPrompt = () => {
      let prompt = template.stringTemplate;
      let remainingConfigs = 0;
      template.configs.forEach((config) => {
        if (config.type === "dropdown" || config.type === "combobox") {
          if (
            selectedValues[config.label] &&
            selectedValues[config.label] !== "None"
          ) {
            prompt = prompt.replace(
              `\${${config.label}}`,
              selectedValues[config.label],
            );
          } else {
            remainingConfigs += 1;
          }
        } else if (config.type === "textarea") {
          if (textareaValues[config.label]) {
            prompt = prompt.replace(
              `\${${config.label}}`,
              textareaValues[config.label],
            );
          } else {
            remainingConfigs += 1;
          }
        } else if (config.type === "array") {
          if (arrayValues[config.label] && arrayValues[config.label].length) {
            const replaceValue = arrayValues[config.label]
              .map((item, index) =>
                item.values
                  .map(
                    (value, labelIndex) =>
                      `\n\t${config.values[labelIndex].value} ${
                        index + 1
                      }: ${value}`,
                  )
                  .join(""),
              )
              .join("\n");

            prompt = prompt.replace(`\${${config.label}}`, `${replaceValue}`);
          } else {
            remainingConfigs += 1;
          }
        }
      });

      // Remove only excessive spaces, not newlines "\n"
      prompt = prompt.replace(/ {2,}/g, " ");
      prompt = prompt.replace(/\\n/g, "\n");

      setPreviewPrompt(prompt);
      setNoRemainingConfigs(remainingConfigs);
    };

    handlePreviewPrompt();
  }, [
    arrayValues,
    selectedValues,
    template.configs,
    template.stringTemplate,
    textareaValues,
  ]);

  // Scroll to the improve suggestion if have
  useEffect(() => {
    setTimeout(() => {
      if (suggestImprovePromptRef && suggestImprovePromptRef.current) {
        suggestImprovePromptRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  });

  const handleGenerateResult = async () => {
    setLoadingStates((prev) => ({ ...prev, evaluating: true }));

    const configValues: Record<string, string> = {};
    template.configs.forEach((config) => {
      if (config.type === "dropdown" || config.type === "combobox") {
        configValues[config.label] = selectedValues[config.label];
      } else if (config.type === "textarea") {
        configValues[config.label] = textareaValues[config.label];
      } else if (config.type === "array") {
        configValues[config.label] = arrayValues[config.label]
          .map((item, index) =>
            item.values
              .map(
                (value, labelIndex) =>
                  `${config.values[labelIndex].value} ${index + 1}: ${value}`,
              )
              .join("\n"),
          )
          .join("\n\n");
      }
    });

    try {
      const result = await mutateGenerateResult(previewPrompt);

      const newResult: EvaluationResult = {
        id: Date.now().toString(),
        configValues,
        prompt: previewPrompt,
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
    const updatedResults = evaluationResults.map((result) => ({
      ...result,
      selected: result.id === resultId,
    }));
    setEvaluationResults(updatedResults);

    const exampleResult = updatedResults.find(
      (result) => result.id === resultId,
    )!.result;

    const serializedData = serializeResultConfigData({
      promptId: template.id,
      data: template,
      selectedValues,
      textareaValues,
      arrayValues,
      exampleResult,
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
                <div
                  className={cn(
                    noRemainingConfigs ? "text-red-500" : "text-green-500",
                  )}
                >
                  Remaining configs: {noRemainingConfigs}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.configs?.map((config) => (
                <div key={config.label}>
                  <div className="flex justify-between">
                    <Label htmlFor={config.label.toLowerCase()}>
                      {config.label}
                    </Label>
                    <Button variant="ghost" className="h-8 w-8 mr-2">
                      <FileQuestion></FileQuestion>
                    </Button>
                  </div>

                  <div className="px-2">
                    {config.type === "combobox" ? (
                      <CreatableCombobox
                        options={config.values}
                        value={selectedValues[config.label]}
                        onChange={(value) =>
                          handleSelectChange(config.label, value)
                        }
                        placeholder={`Select a ${config.label.toLowerCase()}`}
                        onCreateOption={(inputValue) =>
                          handleCreateOption(config.label, inputValue)
                        }
                      />
                    ) : config.type === "dropdown" ? (
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange(config.label, value)
                        }
                      >
                        <SelectTrigger id={config.label}>
                          <SelectValue
                            placeholder={
                              selectedValues[config.label] ??
                              `Select a ${config.label.toLowerCase()}`
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          {config.values.map((value) => (
                            <SelectItem key={value.id} value={value.value}>
                              {value.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : config.type === "textarea" ? (
                      <Textarea
                        id={config.label}
                        placeholder={`Input your content`}
                        value={textareaValues[config.label]}
                        onChange={(e) =>
                          handleTextareaChange(config.label, e.target.value)
                        }
                        // className={config.className}
                      />
                    ) : config.type === "array" ? (
                      <>
                        <ArrayConfig
                          id={config.label}
                          labels={config.values.map((value) => {
                            return value.value;
                          })}
                          values={arrayValues[config.label]}
                          setArrayValues={setArrayValues}
                        ></ArrayConfig>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex w-full gap-2">
              <Button
                className="flex-1"
                onClick={handleGenerateResult}
                // disabled={loadingStates.evaluating || noRemainingConfigs !== 0}
                disabled={loadingStates.evaluating}
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
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSuggestImprovements}
                // disabled={loadingStates.suggesting}
                disabled={true}
              >
                {loadingStates.suggesting ? (
                  <>Analyzing...</>
                ) : (
                  <>Analyze Prompt</>
                )}
              </Button>
            </CardFooter>
          </Card>

          {improvementSuggestions && (
            <Card ref={suggestImprovePromptRef}>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-md border whitespace-pre-wrap">
                  <Markdown>{improvementSuggestions}</Markdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
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
      <Card className="flex-1 w-full">
        <CardHeader>
          <CardTitle className="text-md font-semibold">
            Evaluation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyResult(result.result)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={result.selected ? "default" : "ghost"}
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleSelectResult(result.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2 mb-2">
                    <p className="font-medium">Configuration:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(result.configValues).map(
                        ([key, value]) => (
                          <div key={key} className="flex">
                            <span className="font-medium mr-1">{key}:</span>
                            <span className="overflow-auto whitespace-pre-wrap">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
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
