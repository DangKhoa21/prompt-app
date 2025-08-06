import { HelpCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Technique } from "@/types/techniques/technique";

interface ExampleTabProps {
  technique: Technique;
}

export function ExampleTab({ technique }: ExampleTabProps) {
  const { name, examples } = technique;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Before & After Examples</CardTitle>
          <CardDescription>
            See how applying {name} improves prompt effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h4 className="font-medium text-sm">
                        Before (Basic Prompt)
                      </h4>
                    </div>
                    <div className="text-red-500 border border-red-200 p-3 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        {example.before}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-medium text-sm">
                        After (Enhanced Prompt)
                      </h4>
                    </div>
                    <div className="text-green-500 border border-green-200 p-3 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        {example.after}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="text-blue-50 border border-blue-200 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-sm text-blue-900">
                      Why This Works
                    </h4>
                  </div>
                  <p className="text-sm text-blue-800">{example.explanation}</p>
                </div>
                {index < examples.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
