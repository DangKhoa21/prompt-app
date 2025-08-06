import { ArrowRight, Copy, Download, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Technique, TechniqueBuilder } from "@/types/techniques/technique";
import { appURL } from "@/config/url.config";

interface BuilderTabProps {
  technique: Technique;
  builder: TechniqueBuilder;
  generatePrompt: () => void;
  copyToClipboard: (text: string) => void;
  updateUserPrompt: (value: string) => void;
  updateParameter: (key: string, value: string) => void;
  saveAsTemplate: () => void;
}

export function BuilderTab({
  technique,
  builder,
  generatePrompt,
  copyToClipboard,
  updateUserPrompt,
  updateParameter,
  saveAsTemplate,
}: BuilderTabProps) {
  const { id, name } = technique;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Prompt Builder</CardTitle>
          <CardDescription>
            Build a custom prompt using the {name} technique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-prompt">Your Original Prompt/Question</Label>
              <Textarea
                id="user-prompt"
                placeholder="Enter your basic prompt or question here..."
                value={builder.userPrompt}
                onChange={(e) => updateUserPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* Dynamic parameter inputs based on technique */}
            {id === "few-shot" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="example-1">Example 1 (Input → Output)</Label>
                  <Input
                    id="example-1"
                    placeholder="Input: ... → Output: ..."
                    value={builder.parameters.example_1 || ""}
                    onChange={(e) =>
                      updateParameter("example_1", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="example-2">Example 2 (Input → Output)</Label>
                  <Input
                    id="example-2"
                    placeholder="Input: ... → Output: ..."
                    value={builder.parameters.example_2 || ""}
                    onChange={(e) =>
                      updateParameter("example_2", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="example-3">Example 3 (Input → Output)</Label>
                  <Input
                    id="example-3"
                    placeholder="Input: ... → Output: ..."
                    value={builder.parameters.example_3 || ""}
                    onChange={(e) =>
                      updateParameter("example_3", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {id === "role-prompting" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Role/Profession</Label>
                  <Input
                    id="role"
                    placeholder="e.g., experienced software engineer, marketing expert"
                    value={builder.parameters.role || ""}
                    onChange={(e) => updateParameter("role", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Years of Experience</Label>
                  <Input
                    id="years"
                    placeholder="e.g., 10"
                    value={builder.parameters.years || ""}
                    onChange={(e) => updateParameter("years", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field/Specialization</Label>
                  <Input
                    id="field"
                    placeholder="e.g., web development, digital marketing"
                    value={builder.parameters.field || ""}
                    onChange={(e) => updateParameter("field", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="key_traits">Key Traits</Label>
                  <Input
                    id="key_traits"
                    placeholder="e.g., detail-oriented, practical approach"
                    value={builder.parameters.key_traits || ""}
                    onChange={(e) =>
                      updateParameter("key_traits", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {id === "constraint-prompting" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="length">Length Constraint</Label>
                  <Input
                    id="length"
                    placeholder="e.g., Maximum 200 words, 3 paragraphs"
                    value={builder.parameters.length || ""}
                    onChange={(e) => updateParameter("length", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="format">Format Requirements</Label>
                  <Input
                    id="format"
                    placeholder="e.g., Bullet points, numbered list, table"
                    value={builder.parameters.format || ""}
                    onChange={(e) => updateParameter("format", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="style">Style/Tone</Label>
                  <Input
                    id="style"
                    placeholder="e.g., Professional, casual, technical"
                    value={builder.parameters.style || ""}
                    onChange={(e) => updateParameter("style", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Beginners, experts, general public"
                    value={builder.parameters.audience || ""}
                    onChange={(e) =>
                      updateParameter("audience", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <Button
              onClick={generatePrompt}
              className="w-full"
              disabled={!builder.userPrompt}
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Enhanced Prompt
            </Button>
          </div>

          {builder.generatedPrompt && (
            <div className="space-y-4">
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Generated Prompt</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(builder.generatedPrompt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveAsTemplate}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save as Template
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={appURL.chat}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Test in Chat
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="text-green-50 border border-green-200 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">
                    {builder.generatedPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
