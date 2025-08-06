import { CheckCircle, Copy } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Technique } from "@/types/techniques/technique";

interface OverviewProps {
  technique: Technique;
  copyToClipboard: (text: string) => void;
  // handleBuildPrompt: (technique: Technique) => void;
}

export function OverviewTab({
  technique,
  copyToClipboard,
  // handleBuildPrompt,
}: OverviewProps) {
  const {
    icon,
    name,
    description,
    difficulty,
    category,
    useCase,
    steps,
    tips,
    template,
  } = technique;
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-primary">{icon}</div>
              <div>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{difficulty}</Badge>
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">When to Use</h3>
            <p className="text-sm text-muted-foreground">{useCase}</p>
          </div>

          <div>
            <h3 className="font-medium mb-3">How to Apply</h3>
            <ol className="space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="flex-none w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-medium mb-3">Pro Tips</h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-none" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Template</h3>
            <div className="p-4 rounded-md border">
              <pre className="text-sm whitespace-pre-wrap">{template}</pre>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(template)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </Button>
              {/* <Button */}
              {/*   variant="outline" */}
              {/*   size="sm" */}
              {/*   // onClick={() => handleBuildPrompt(technique)} */}
              {/* > */}
              {/*   <Zap className="h-4 w-4 mr-2" /> */}
              {/*   Use Builder */}
              {/* </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
