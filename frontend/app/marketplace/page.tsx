import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { PromptTemplateCard } from "@/components/prompt-template-card"
import { Search } from 'lucide-react'

const templates = Array(9).fill({
  title: "Translate",
  description: "Translate the provided text into your desired language",
  rating: "4.5k",
  author: "someone"
})

const filters = Array(6).fill("Summarize").concat(["More"])

export default function Page() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-6">
            Discover and create custom versions prompts that combine instructions,
            extra knowledge, and any combination of skills.
          </p>
  
          <div className="inline-flex relative mb-6 min-w-[600px] justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9"
            />
            </div>  
          </div>
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {filters.map((filter, i) => (
            <Button
              key={i}
              variant={i === filters.length - 1 ? "default" : "secondary"}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 justify-evenly md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, i) => (
            <PromptTemplateCard key={i} {...template} />
          ))}
        </div>
      </div>
    </main>
  )
}
