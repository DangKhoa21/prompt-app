"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function PromptGeneratorSidebar() {
    const [tone, setTone] = useState("")
    const [length, setLength] = useState("")
    const [context, setContext] = useState("")
    const [keywords, setKeywords] = useState("")
    const [generatedPrompt, setGeneratedPrompt] = useState("")

    const generatePrompt = () => {
        // This is a simple prompt generation logic. You can make it more sophisticated as needed.
        const prompt = `Generate a ${tone} response, approximately ${length} words long.
Context: ${context}
Include the following keywords: ${keywords}`
        setGeneratedPrompt(prompt)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <h2 className="text-lg font-semibold">Prompt Generator</h2>

                <div className="space-y-2">
                    <Label htmlFor="tone">Tone/Style</Label>
                    <Select onValueChange={setTone}>
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="length">Desired Length (words)</Label>
                    <Input
                        id="length"
                        type="number"
                        placeholder="e.g., 100"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Textarea
                        id="context"
                        placeholder="Provide context for your prompt"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Textarea
                        id="keywords"
                        placeholder="Enter keywords (comma-separated)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="min-h-[80px]"
                    />
                </div>

                {generatedPrompt && (
                    <div className="space-y-2">
                        <Label htmlFor="generated-prompt">Generated Prompt</Label>
                        <Textarea
                            id="generated-prompt"
                            value={generatedPrompt}
                            readOnly
                            className="h-32"
                        />
                    </div>
                )}
            </div>

            <div className="p-4 border-t">
                <Button onClick={generatePrompt} className="w-full">
                    Generate Prompt
                </Button>
            </div>
        </div>
    )
}

