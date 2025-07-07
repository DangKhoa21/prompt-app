"use client";

import {
  BuilderTab,
  ExampleTab,
  OverviewTab,
  SidebarList,
} from "@/components/techniques";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { techniques } from "@/constants/techniques";

import { Brain, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Technique, TechniqueBuilder } from "./technique-type";

export default function TechniquesPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [builder, setBuilder] = useState<TechniqueBuilder>({
    id: "",
    userPrompt: "",
    selectedTechnique: "",
    parameters: {},
    generatedPrompt: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredTechniques = techniques.filter(
    (technique) =>
      selectedCategory === "All" || technique.category === selectedCategory,
  );

  const handleTechniqueSelect = (technique: Technique) => {
    setSelectedTechnique(technique);
    setActiveTab("overview");
  };

  const handleBuildPrompt = (technique: Technique) => {
    setBuilder({
      id: technique.id,
      userPrompt: "",
      selectedTechnique: technique.id,
      parameters: {},
      generatedPrompt: "",
    });
    setActiveTab("builder");
  };

  const generatePrompt = () => {
    if (!builder.userPrompt || !selectedTechnique) return;

    let generated = selectedTechnique.template;

    // Replace common placeholders
    generated = generated.replace(/\[task\]/g, builder.userPrompt);
    generated = generated.replace(/\[user_input\]/g, builder.userPrompt);
    generated = generated.replace(
      /\[Your request\/question\]/g,
      builder.userPrompt,
    );
    generated = generated.replace(
      /\[Your original request\]/g,
      builder.userPrompt,
    );
    generated = generated.replace(/\[Your request\]/g, builder.userPrompt);

    // Replace parameter placeholders
    Object.entries(builder.parameters).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      generated = generated.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        value,
      );
    });

    setBuilder((prev) => ({ ...prev, generatedPrompt: generated }));
  };

  const copyToClipboard = (text: string) => {
    if (!isClient) return;
    navigator.clipboard.writeText(text);
  };

  const saveAsTemplate = () => {
    if (!isClient) return;
    // In a real app, this would save to the user's templates
  };

  const updateUserPrompt = (value: string) => {
    setBuilder((prev) => ({
      ...prev,
      userPrompt: value,
    }));
  };

  const updateParameter = (key: string, value: string) => {
    setBuilder((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value,
      },
    }));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 rounded w-1/4"></div>
            <div className="h-32 rounded"></div>
            <div className="h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Prompt Techniques</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Prompt Engineering Techniques
            </h1>
            <p className="text-muted-foreground">
              Master advanced prompting techniques to get better results from AI
              models. Learn, practice, and apply proven methods used by experts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Technique List */}
            <div className="lg:col-span-1">
              <SidebarList
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredTechniques={filteredTechniques}
                selectedTechnique={selectedTechnique}
                handleTechniqueSelect={handleTechniqueSelect}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedTechnique ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="builder">Builder</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <OverviewTab
                      technique={selectedTechnique}
                      copyToClipboard={copyToClipboard}
                      handleBuildPrompt={handleBuildPrompt}
                    />
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-6">
                    <ExampleTab technique={selectedTechnique} />
                  </TabsContent>

                  <TabsContent value="builder" className="space-y-6">
                    <BuilderTab
                      technique={selectedTechnique}
                      builder={builder}
                      generatePrompt={generatePrompt}
                      copyToClipboard={copyToClipboard}
                      updateUserPrompt={updateUserPrompt}
                      updateParameter={updateParameter}
                      saveAsTemplate={saveAsTemplate}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select a Technique
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a prompt engineering technique from the sidebar to
                      learn more about it.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
