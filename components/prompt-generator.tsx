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

function capitalize(str: string): string {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function PromptGeneratorSidebar() {
    const CreateState = () => {
        const [state, setState] = useState("")
        return { state, setState }
    }

    const inputFields = [
        {
            label: "tone",
            labelName: 'Tone/Style',
            labelPlaceholder: "Select tone",
            type: "select",
            state: CreateState(),
            values: [
                "professional",
                "casual",
                "formal",
                "friendly",
            ],
            className: "",
        },
        {
            label: "length",
            labelName: 'Desired Length (words)',
            labelPlaceholder: "e.g., 100",
            type: "input",
            state: CreateState(),
            values: {
                id: "length",
                type: "number",
            },
            className: "",
        },
        {
            label: "context",
            labelName: 'Context',
            labelPlaceholder: "Provide context for your prompt",
            type: "textarea",
            state: CreateState(),
            values: {
                id: "context",
            },
            className: "min-h-[100px]",
        },
        {
            label: "keywords",
            labelName: 'Keywords',
            labelPlaceholder: "Enter keywords (comma-separated)",
            type: "textarea",
            state: CreateState(),
            values: {
                id: "keywords",
            },
            className: "min-h-[80px]",
        }
    ]

    // const [tone, setTone] = useState("")
    // const [length, setLength] = useState("")
    // const [context, setContext] = useState("")
    // const [keywords, setKeywords] = useState("")
    const [generatedPrompt, setGeneratedPrompt] = useState("")

    const generatePrompt = () => {
        // Template prompt
        //         const prompt = `Generate a ${tone} response, approximately ${length} words long.
        // Context: ${context}
        // Include the following keywords: ${keywords}`

        const findState = (field: string) => {
            const output = inputFields.find((item) => item.label === field)?.state.state || "";
            return output;
        }

        const prompt = `Generate a ${findState("tone")} response, approximately ${findState("length")} words long.
Context: ${findState("context")}
Include the following keywords: ${findState("keywords")}`;

        setGeneratedPrompt(prompt)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <h2 className="text-lg font-semibold">Prompt Generator</h2>

                {inputFields.map((item) => (
                    <div className="space-y-2" key={item.label}>
                        <label htmlFor={item.label}>{item.labelName}</label>

                        {Array.isArray(item.values) ? (
                            <Select onValueChange={item.state.setState}>
                                <SelectTrigger id={item.label}>
                                    <SelectValue placeholder={item.labelPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.values.map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {capitalize(value)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : item.type === "input" ? (
                            <Input
                                id={item.label}
                                type={item.values.type}
                                placeholder={item.labelPlaceholder}
                                value={item.state.state}
                                onChange={(e) => item.state.setState(e.target.value)}
                                className={item.className}
                            />
                        ) : (
                            <Textarea
                                id={item.label}
                                placeholder={item.labelPlaceholder}
                                value={item.state.state}
                                onChange={(e) => item.state.setState(e.target.value)}
                                className={item.className}
                            />
                        )}
                    </div>
                ))}

                {/* <div className="space-y-2">
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
                </div> */}

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

