import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "@/constants/techniques";
import { Technique } from "@/types/techniques/technique";
import { BookOpen } from "lucide-react";

interface SidebarListProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredTechniques: Technique[];
  selectedTechnique: Technique | null;
  handleTechniqueSelect: (technique: Technique) => void;
}

export function SidebarList({
  selectedCategory,
  setSelectedCategory,
  filteredTechniques,
  selectedTechnique,
  handleTechniqueSelect,
}: SidebarListProps) {
  return (
    <>
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Techniques
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredTechniques.map((technique) => (
                <div
                  key={technique.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTechnique?.id === technique.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleTechniqueSelect(technique)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1">{technique.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{technique.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {technique.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {technique.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {technique.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
