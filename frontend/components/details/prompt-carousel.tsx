import { PromptCard } from "@/services/prompt/interface";

interface PromptCarouselProps {
  prompts: PromptCard[];
  className?: string;
}

export default function PromptCarousel({ prompts, className }: PromptCarouselProps) {
  console.log(prompts, className);

  return <></>;
}
