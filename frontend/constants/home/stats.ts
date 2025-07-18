import { Stat } from "@/types/home/content";
import { BookOpen, Globe, TrendingUp, Users } from "lucide-react";

export const stats: Stat[] = [
  { label: "Active Users", value: "100+", icon: Users },
  { label: "Prompt Templates", value: "100+", icon: BookOpen },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
  { label: "Countries", value: "120+", icon: Globe },
];
