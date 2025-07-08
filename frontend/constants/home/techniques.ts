import { Technique } from "@/types/home/content";
import { Lightbulb, Brain, Target, Code } from "lucide-react";

export const techniques: Technique[] = [
  {
    icon: Lightbulb,
    name: "Few-Shot Prompting",
    description: "Guide AI with examples",
    difficulty: "Beginner",
  },
  {
    icon: Brain,
    name: "Chain of Thought",
    description: "Step-by-step reasoning",
    difficulty: "Intermediate",
  },
  {
    icon: Target,
    name: "Constraint Prompting",
    description: "Focused responses",
    difficulty: "Beginner",
  },
  {
    icon: Code,
    name: "Prompt Chaining",
    description: "Previous Output for next Input",
    difficulty: "Advanced",
  },
];
