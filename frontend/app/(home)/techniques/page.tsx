"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Lightbulb,
  Target,
  Layers,
  GitBranch,
  Zap,
  BookOpen,
  Copy,
  Download,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface Technique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  useCase: string;
  template: string;
  examples: {
    before: string;
    after: string;
    explanation: string;
  }[];
  steps: string[];
  tips: string[];
}

interface TechniqueBuilder {
  id: string;
  userPrompt: string;
  selectedTechnique: string;
  parameters: Record<string, string>;
  generatedPrompt: string;
}

const techniques: Technique[] = [
  {
    id: "few-shot",
    name: "Few-Shot Prompting",
    description: "Provide examples to guide the AI's response format and style",
    icon: <Target className="h-5 w-5" />,
    category: "Examples",
    difficulty: "Beginner",
    useCase: "When you want consistent output format or style",
    template: `Here are some examples of [task]:

Example 1:
Input: [example_input_1]
Output: [example_output_1]

Example 2:
Input: [example_input_2]
Output: [example_output_2]

Example 3:
Input: [example_input_3]
Output: [example_output_3]

Now, please [task] for:
Input: [user_input]
Output:`,
    examples: [
      {
        before:
          "Classify this email as spam or not spam: 'Win $1000 now! Click here!'",
        after: `Here are some examples of email classification:

Example 1:
Input: "Meeting tomorrow at 3pm in conference room A"
Output: Not Spam

Example 2:
Input: "URGENT! You've won $10,000! Click now!"
Output: Spam

Example 3:
Input: "Your order #12345 has been shipped"
Output: Not Spam

Now, please classify this email:
Input: "Win $1000 now! Click here!"
Output:`,
        explanation:
          "By providing examples, the AI understands the exact format and criteria for classification.",
      },
    ],
    steps: [
      "Identify 2-5 representative examples of your desired input-output pairs",
      "Format examples consistently with clear Input/Output labels",
      "Place examples before your actual query",
      "Use the same format for your final request",
    ],
    tips: [
      "Use diverse examples that cover edge cases",
      "Keep examples concise but representative",
      "Maintain consistent formatting across all examples",
      "3-5 examples usually work better than just 1-2",
    ],
  },
  {
    id: "chain-of-thought",
    name: "Chain of Thought",
    description: "Guide the AI to show its reasoning process step by step",
    icon: <GitBranch className="h-5 w-5" />,
    category: "Reasoning",
    difficulty: "Intermediate",
    useCase: "For complex problems requiring logical reasoning",
    template: `[Your question or problem]

Let's think through this step by step:

1. First, I need to [step_1]
2. Then, I should [step_2]  
3. Next, I'll [step_3]
4. Finally, I can [step_4]

Please show your reasoning for each step.`,
    examples: [
      {
        before: "What's 15% of 240?",
        after: `What's 15% of 240?

Let's think through this step by step:

1. First, I need to convert 15% to a decimal: 15% = 15/100 = 0.15
2. Then, I should multiply this decimal by 240: 0.15 × 240
3. Next, I'll calculate: 0.15 × 240 = 36
4. Finally, I can verify: 36 is 15% of 240

Please show your reasoning for each step.`,
        explanation:
          "Breaking down the problem into steps makes the AI show its work and reduces errors.",
      },
    ],
    steps: [
      "Identify the key steps needed to solve your problem",
      "Add 'Let's think through this step by step' or similar phrase",
      "List out the logical sequence of steps",
      "Ask the AI to show reasoning for each step",
    ],
    tips: [
      "Use phrases like 'step by step', 'let's break this down', 'think carefully'",
      "Number your steps for clarity",
      "Works especially well for math, logic, and analysis tasks",
      "Can be combined with few-shot examples",
    ],
  },
  {
    id: "meta-prompting",
    name: "Meta Prompting",
    description: "Ask the AI to improve or analyze the prompt itself",
    icon: <Brain className="h-5 w-5" />,
    category: "Meta",
    difficulty: "Advanced",
    useCase: "To optimize prompts or get AI assistance in prompt design",
    template: `I want to create a prompt for [task]. Here's my current prompt:

"[current_prompt]"

Please analyze this prompt and suggest improvements. Consider:
1. Clarity and specificity
2. Missing context or constraints
3. Better structure or formatting
4. Potential ambiguities

Then provide an improved version of the prompt.`,
    examples: [
      {
        before: "Write a story about a dog.",
        after: `I want to create a prompt for creative story writing. Here's my current prompt:

"Write a story about a dog."

Please analyze this prompt and suggest improvements. Consider:
1. Clarity and specificity
2. Missing context or constraints  
3. Better structure or formatting
4. Potential ambiguities

Then provide an improved version of the prompt.`,
        explanation:
          "Meta prompting helps you iteratively improve your prompts by getting AI feedback.",
      },
    ],
    steps: [
      "Present your current prompt to the AI",
      "Ask for specific analysis (clarity, completeness, structure)",
      "Request an improved version",
      "Iterate based on the suggestions",
    ],
    tips: [
      "Be specific about what aspects to improve",
      "Ask for multiple alternative versions",
      "Use this technique to learn prompt engineering",
      "Great for complex or high-stakes prompts",
    ],
  },
  {
    id: "self-reflection",
    name: "Self-Reflection",
    description: "Ask the AI to evaluate and improve its own responses",
    icon: <Lightbulb className="h-5 w-5" />,
    category: "Quality",
    difficulty: "Intermediate",
    useCase: "To improve response quality and catch errors",
    template: `[Your original request]

After providing your response, please:
1. Review your answer for accuracy and completeness
2. Identify any potential issues or improvements
3. Provide a revised version if needed
4. Rate your confidence in the response (1-10)`,
    examples: [
      {
        before: "Explain quantum computing.",
        after: `Explain quantum computing.

After providing your response, please:
1. Review your answer for accuracy and completeness
2. Identify any potential issues or improvements  
3. Provide a revised version if needed
4. Rate your confidence in the response (1-10)`,
        explanation:
          "Self-reflection prompts help the AI catch its own mistakes and provide better responses.",
      },
    ],
    steps: [
      "Make your original request",
      "Ask the AI to review its own response",
      "Request identification of potential issues",
      "Ask for improvements or revisions",
    ],
    tips: [
      "Ask for confidence ratings to gauge reliability",
      "Use for important or complex topics",
      "Can reveal AI's uncertainty about topics",
      "Combine with other techniques for best results",
    ],
  },
  {
    id: "role-prompting",
    name: "Role Prompting",
    description: "Assign a specific role or persona to the AI",
    icon: <Sparkles className="h-5 w-5" />,
    category: "Context",
    difficulty: "Beginner",
    useCase: "To get responses from a specific perspective or expertise",
    template: `You are a [role/profession] with [years] years of experience in [field]. You are known for [key_traits].

[Your request/question]

Please respond as this character would, using appropriate:
- Terminology and jargon
- Perspective and priorities  
- Communication style
- Level of detail`,
    examples: [
      {
        before: "How do I invest my money?",
        after: `You are a certified financial advisor with 15 years of experience in wealth management. You are known for conservative, long-term investment strategies and clear communication with clients.

How do I invest my money?

Please respond as this character would, using appropriate:
- Terminology and jargon
- Perspective and priorities
- Communication style  
- Level of detail`,
        explanation:
          "Role prompting provides context and expertise, leading to more relevant and authoritative responses.",
      },
    ],
    steps: [
      "Choose a relevant role or profession",
      "Define their experience and expertise",
      "Specify key traits or approaches",
      "Ask them to respond in character",
    ],
    tips: [
      "Be specific about the role's background",
      "Include personality traits for more authentic responses",
      "Works well for advice, analysis, and creative tasks",
      "Can combine multiple roles for different perspectives",
    ],
  },
  {
    id: "constraint-prompting",
    name: "Constraint Prompting",
    description: "Set specific limitations or requirements for the response",
    icon: <Layers className="h-5 w-5" />,
    category: "Structure",
    difficulty: "Beginner",
    useCase: "To get responses in specific formats or with certain limitations",
    template: `[Your request]

Please follow these constraints:
- Length: [word/character limit]
- Format: [specific format requirements]
- Style: [tone, formality level]
- Content: [what to include/exclude]
- Audience: [target audience]

Additional requirements:
- [requirement_1]
- [requirement_2]
- [requirement_3]`,
    examples: [
      {
        before: "Explain artificial intelligence.",
        after: `Explain artificial intelligence.

Please follow these constraints:
- Length: Maximum 100 words
- Format: 3 bullet points
- Style: Simple, non-technical language
- Content: Focus on practical applications
- Audience: Complete beginners

Additional requirements:
- Use analogies where helpful
- Avoid technical jargon
- Include one real-world example`,
        explanation:
          "Constraints help you get exactly the type of response you need for your specific use case.",
      },
    ],
    steps: [
      "Identify your specific requirements",
      "Set clear length and format constraints",
      "Specify style and tone requirements",
      "Define what to include or exclude",
    ],
    tips: [
      "Be specific about word/character limits",
      "Specify format requirements clearly",
      "Consider your audience when setting constraints",
      "Use constraints to fit responses into existing workflows",
    ],
  },
  {
    id: "rag-prompting",
    name: "RAG (Retrieval-Augmented Generation)",
    description:
      "Combine external knowledge retrieval with AI generation for accurate, up-to-date responses",
    icon: <BookOpen className="h-5 w-5" />,
    category: "Advanced",
    difficulty: "Advanced",
    useCase:
      "When you need current information or domain-specific knowledge not in training data",
    template: `Based on the following retrieved information:

CONTEXT:
[retrieved_document_1]
Source: [source_1]

[retrieved_document_2] 
Source: [source_2]

[retrieved_document_3]
Source: [source_3]

QUERY: [user_question]

Please answer the query using ONLY the information provided in the context above. If the context doesn't contain enough information to answer the question, say so explicitly. Always cite your sources.

Guidelines:
- Quote directly from sources when possible
- Indicate uncertainty if information is incomplete
- Distinguish between facts and opinions in the sources
- Provide source citations for each claim`,
    examples: [
      {
        before: "What are the latest developments in quantum computing?",
        after: `Based on the following retrieved information:

CONTEXT:
IBM announced a 1000-qubit quantum processor called Condor in December 2023, representing a significant milestone in quantum computing hardware development.
Source: IBM Research Blog, December 2023

Google's quantum computer achieved quantum error correction breakthrough, successfully reducing error rates below the threshold needed for practical quantum computing.
Source: Nature Journal, February 2024

Microsoft partnered with Quantinuum to demonstrate logical qubits with error rates 800 times lower than physical qubits.
Source: Microsoft Azure Quantum Blog, January 2024

QUERY: What are the latest developments in quantum computing?

Please answer the query using ONLY the information provided in the context above...`,
        explanation:
          "RAG ensures responses are grounded in specific, retrievable sources rather than potentially outdated training data.",
      },
    ],
    steps: [
      "Identify relevant sources or documents for your query",
      "Retrieve and include specific passages as context",
      "Structure the prompt with clear CONTEXT and QUERY sections",
      "Instruct the AI to only use provided information",
      "Require source citations for all claims",
    ],
    tips: [
      "Use multiple diverse sources for comprehensive coverage",
      "Include source metadata (dates, authors, publications)",
      "Explicitly instruct to cite sources and indicate uncertainty",
      "Works best with factual, knowledge-intensive queries",
      "Can be automated with vector databases and retrieval systems",
    ],
  },
  {
    id: "react-prompting",
    name: "ReAct (Reasoning + Acting)",
    description:
      "Interleave reasoning and action steps for complex problem-solving with tools",
    icon: <Zap className="h-5 w-5" />,
    category: "Advanced",
    difficulty: "Advanced",
    useCase:
      "For multi-step problems requiring both reasoning and external tool usage",
    template: `You will solve this problem by alternating between Thought, Action, and Observation steps.

PROBLEM: [problem_description]

Available Actions:
- search(query): Search for information
- calculate(expression): Perform calculations  
- code(program): Execute code
- analyze(data): Analyze data

Format:
Thought: [your reasoning about what to do next]
Action: [action_name(parameters)]
Observation: [result of the action]

Continue this cycle until you reach a final answer.

Thought: Let me start by understanding what I need to do...`,
    examples: [
      {
        before:
          "What's the population density of Tokyo compared to New York City?",
        after: `You will solve this problem by alternating between Thought, Action, and Observation steps.

PROBLEM: What's the population density of Tokyo compared to New York City?

Available Actions:
- search(query): Search for information
- calculate(expression): Perform calculations

Format:
Thought: [your reasoning]
Action: [action_name(parameters)]
Observation: [result]

Thought: I need to find the population and area of both Tokyo and NYC to calculate density.
Action: search("Tokyo population area square kilometers 2024")
Observation: Tokyo has 13.96 million people in 2,194 km²

Thought: Now I need the same data for New York City.
Action: search("New York City population area square kilometers 2024")
Observation: NYC has 8.34 million people in 783 km²

Thought: Now I can calculate the population densities.
Action: calculate("13960000 / 2194")
Observation: Tokyo density = 6,364 people/km²

Action: calculate("8340000 / 783")
Observation: NYC density = 10,651 people/km²`,
        explanation:
          "ReAct breaks complex problems into reasoning and action cycles, making the process transparent and verifiable.",
      },
    ],
    steps: [
      "Define the problem clearly",
      "List available actions/tools",
      "Start with a reasoning step (Thought)",
      "Take an action based on reasoning",
      "Observe and record the result",
      "Repeat until problem is solved",
    ],
    tips: [
      "Make reasoning explicit in each Thought step",
      "Use specific, parameterized actions",
      "Record all observations accurately",
      "Plan multiple steps ahead when possible",
      "Great for research, analysis, and multi-step calculations",
    ],
  },
  //   {
  //     id: "program-aided",
  //     name: "Program-Aided Language Models (PAL)",
  //     description: "Generate and execute code to solve complex computational problems",
  //     icon: <Brain className="h-5 w-5" />,
  //     category: "Advanced",
  //     difficulty: "Advanced",
  //     useCase: "For mathematical, logical, or computational problems requiring precise calculations",
  //     template: `Problem: [problem_description]
  //
  // I'll solve this step by step by writing and executing code.
  //
  // # Step 1: Understand the problem
  // [problem_analysis]
  //
  // # Step 2: Write the solution code
  // \`\`\`python
  // # [code_explanation]
  // [python_code]
  // \`\`\`
  //
  // # Step 3: Execute and verify
  // Let me trace through the execution:
  // [execution_trace]
  //
  // # Step 4: Final answer
  // [final_answer]`,
  //     examples: [
  //       {
  //         before: "A company's revenue grows by 15% each year. If they start with $100,000, what will their revenue be after 8 years?",
  //         after: `Problem: A company's revenue grows by 15% each year. If they start with $100,000, what will their revenue be after 8 years?
  //
  // I'll solve this step by step by writing and executing code.
  //
  // # Step 1: Understand the problem
  // This is a compound growth problem where revenue = initial_amount × (1 + growth_rate)^years
  //
  // # Step 2: Write the solution code
  // \`\`\`python
  // # Calculate compound growth
  // initial_revenue = 100000
  // growth_rate = 0.15
  // years = 8
  //
  // final_revenue = initial_revenue * (1 + growth_rate) ** years
  // print(f\"After {years} years: ${final_revenue:,.2f}\")
  // \
  // # Show year-by-year breakdown\
  // revenue = initial_revenue\
  // for year in range(1, years + 1):\
  //     revenue *= (1 + growth_rate)\
  //     print(f\"Year {year}: ${revenue:,.2f}")
  // \`\`\`
  //
  // # Step 3: Execute and verify
  // Year 1: $115,000.00
  // Year 2: $132,250.00
  // Year 8: $305,902.46
  //
  // # Step 4: Final answer
  // After 8 years, the company's revenue will be $305,902.46`,
  //         explanation: \"PAL leverages code execution for precise calculations while maintaining clear reasoning.",
  //       },
  //     ],
  //     steps: [
  //       "Analyze the problem to identify computational requirements",
  //       "Write clear, executable code with comments",
  //       "Show the execution process step by step",
  //       "Verify results and provide final answer",
  //     ],
  //     tips: [
  //       "Use code for any mathematical or logical operations",
  //       "Include comments explaining the logic",
  //       "Show intermediate steps for transparency",
  //       "Verify results with alternative approaches when possible",
  //       "Great for math, data analysis, and algorithmic problems",
  //     ],
  //   },
  //   {
  //     id: "automatic-prompt-engineering",
  //     name: "Automatic Prompt Engineering (APE)",
  //     description: "Use AI to automatically generate and optimize prompts for better performance",
  //     icon: <Brain className="h-5 w-5" />,
  //     category: "Meta",
  //     difficulty: "Advanced",
  //     useCase: "To systematically improve prompt performance without manual iteration",
  //     template: `I want to create the best possible prompt for: [task_description]
  //
  // Please generate 5 different prompt variations that could work well for this task. For each variation, consider:
  // - Different instruction styles (direct, conversational, step-by-step)
  // - Various levels of specificity and context
  // - Different output format requirements
  // - Alternative reasoning approaches
  //
  // After generating the variations, analyze each one and predict which would perform best and why.
  //
  // TASK: [task_description]
  // TARGET AUDIENCE: [audience]
  // DESIRED OUTPUT: [output_format]
  // CONSTRAINTS: [any_constraints]
  //
  // Generate the prompt variations:`,
  //     examples: [
  //       {
  //         before: "I need a prompt for summarizing research papers.",
  //         after: `I want to create the best possible prompt for: summarizing academic research papers
  //
  // Please generate 5 different prompt variations that could work well for this task...
  //
  // TASK: Summarizing academic research papers
  // TARGET AUDIENCE: Researchers and students
  // DESIRED OUTPUT: Structured summary with key findings
  // CONSTRAINTS: Must be under 300 words
  //
  // Generate the prompt variations:
  //
  // Variation 1 (Direct): "Summarize this research paper in under 300 words. Include: research question, methodology, key findings, and implications."
  //
  // Variation 2 (Structured): "Please provide a structured summary with these sections: 1) Research Question 2) Methods 3) Key Results 4) Significance..."
  //
  // Variation 3 (Role-based): "You are a research librarian. Create a concise summary of this paper for fellow researchers..."
  //
  // [Analysis of which variation would work best and why]`,
  //         explanation: "APE automates the prompt optimization process by generating and evaluating multiple approaches.",
  //       },
  //     ],
  //     steps: [
  //       "Define the task and requirements clearly",
  //       "Generate multiple prompt variations with different approaches",
  //       "Analyze the strengths and weaknesses of each variation",
  //       "Test variations on sample inputs if possible",
  //       "Select and refine the best-performing prompt",
  //     ],
  //     tips: [
  //       "Generate diverse variations, not just minor tweaks",
  //       "Consider different instruction styles and formats",
  //       "Test with representative examples when possible",
  //       "Iterate based on performance feedback",
  //       "Can be automated with evaluation metrics",
  //     ],
  //   },
  //   {
  //     id: "tree-of-thoughts",
  //     name: "Tree of Thoughts (ToT)",
  //     description: "Explore multiple reasoning paths simultaneously and select the best approach",
  //     icon: <GitBranch className="h-5 w-5" />,
  //     category: "Reasoning",
  //     difficulty: "Advanced",
  //     useCase: "For complex problems with multiple possible solution approaches",
  //     template: `Problem: [problem_description]
  //
  // I'll explore multiple reasoning paths to find the best solution.
  //
  // ## Initial Analysis
  // [problem_breakdown]
  //
  // ## Reasoning Path 1: [approach_1_name]
  // Thought: [reasoning_1]
  // Evaluation: [pros_and_cons_1]
  // Confidence: [1-10]
  //
  // ## Reasoning Path 2: [approach_2_name]
  // Thought: [reasoning_2]
  // Evaluation: [pros_and_cons_2]
  // Confidence: [1-10]
  //
  // ## Reasoning Path 3: [approach_3_name]
  // Thought: [reasoning_3]
  // Evaluation: [pros_and_cons_3]
  // Confidence: [1-10]
  //
  // ## Path Selection
  // Best path: [selected_path] because [justification]
  //
  // ## Final Solution
  // [detailed_solution_following_best_path]`,
  //     examples: [
  //       {
  //         before: "How should a startup prioritize features for their MVP?",
  //         after: `Problem: How should a startup prioritize features for their MVP?
  //
  // I'll explore multiple reasoning paths to find the best solution.
  //
  // ## Initial Analysis
  // This involves balancing user needs, technical feasibility, business value, and resource constraints.
  //
  // ## Reasoning Path 1: User-Centric Approach
  // Thought: Prioritize based on user research and pain points
  // Evaluation: Pros - ensures product-market fit; Cons - may miss business opportunities
  // Confidence: 8/10
  //
  // ## Reasoning Path 2: Business Value Framework
  // Thought: Use impact vs effort matrix with revenue potential
  // Evaluation: Pros - maximizes ROI; Cons - might ignore user experience
  // Confidence: 7/10
  //
  // ## Reasoning Path 3: Technical Risk Assessment
  // Thought: Start with core technical challenges and build around them
  // Evaluation: Pros - reduces technical debt; Cons - may delay user validation
  // Confidence: 6/10
  //
  // ## Path Selection
  // Best path: Hybrid of Path 1 and 2 because it balances user needs with business viability
  //
  // ## Final Solution
  // [Detailed framework combining user research with business impact analysis]`,
  //         explanation: "ToT allows systematic exploration of different approaches before committing to a solution path.",
  //       },
  //     ],
  //     steps: [
  //       "Break down the problem into key components",
  //       "Generate 3-5 different reasoning approaches",
  //       "Evaluate each path's strengths and weaknesses",
  //       "Assign confidence scores to each approach",
  //       "Select the best path based on evaluation",
  //       "Execute the chosen approach in detail",
  //     ],
  //     tips: [
  //       "Generate truly different approaches, not variations",
  //       "Be honest about pros and cons of each path",
  //       "Consider combining elements from multiple paths",
  //       "Use confidence scores to guide selection",
  //       "Great for strategic decisions and complex analysis",
  //     ],
  //   },
  //   {
  //     id: "constitutional-ai",
  //     name: "Constitutional AI",
  //     description: "Self-correct responses based on predefined principles and values",
  //     icon: <CheckCircle className="h-5 w-5" />,
  //     category: "Quality",
  //     difficulty: "Advanced",
  //     useCase: "To ensure responses align with specific principles, ethics, or guidelines",
  //     template: `[Your original request]
  //
  // Constitutional Principles:
  // 1. [principle_1]
  // 2. [principle_2]
  // 3. [principle_3]
  // 4. [principle_4]
  //
  // Process:
  // 1. First, provide your initial response
  // 2. Then, review your response against each constitutional principle
  // 3. Identify any violations or areas for improvement
  // 4. Provide a revised response that better adheres to the principles
  // 5. Explain the changes made and why
  //
  // Initial Response:
  // [initial_answer]
  //
  // Constitutional Review:
  // - Principle 1: [evaluation_and_issues]
  // - Principle 2: [evaluation_and_issues]
  // - Principle 3: [evaluation_and_issues]
  // - Principle 4: [evaluation_and_issues]
  //
  // Revised Response:
  // [improved_answer]
  //
  // Changes Made:
  // [explanation_of_revisions]`,
  //     examples: [
  //       {
  //         before: "Give me advice on handling a difficult employee.",
  //         after: `Give me advice on handling a difficult employee.
  //
  // Constitutional Principles:
  // 1. Respect human dignity and avoid discriminatory language
  // 2. Provide balanced, fair solutions that consider all parties
  // 3. Emphasize constructive rather than punitive approaches
  // 4. Acknowledge complexity and avoid oversimplification
  //
  // Process:
  // 1. First, provide your initial response
  // 2. Then, review your response against each constitutional principle...
  //
  // Initial Response:
  // "Fire them immediately. Difficult employees are toxic and will bring down the whole team."
  //
  // Constitutional Review:
  // - Principle 1: ✗ Lacks respect for the employee as a person
  // - Principle 2: ✗ Only considers employer perspective
  // - Principle 3: ✗ Purely punitive, no constructive elements
  // - Principle 4: ✗ Oversimplifies a complex situation
  //
  // Revised Response:
  // "Address difficult employee behavior through: 1) Private conversation to understand root causes, 2) Clear expectations and documentation, 3) Coaching and support resources, 4) Progressive discipline if needed. Consider that 'difficult' behavior often stems from unclear expectations, personal issues, or misalignment with role requirements."
  //
  // Changes Made:
  // Added empathy, balanced perspective, constructive solutions, and acknowledged complexity.`,
  //         explanation:
  //           "Constitutional AI ensures responses meet ethical and quality standards through systematic self-review.",
  //       },
  //     ],
  //     steps: [
  //       "Define clear constitutional principles for your domain",
  //       "Generate an initial response to the query",
  //       "Systematically review against each principle",
  //       "Identify violations or improvement areas",
  //       "Revise the response to better align with principles",
  //       "Document changes and reasoning",
  //     ],
  //     tips: [
  //       "Make principles specific and actionable",
  //       "Be thorough in the review process",
  //       "Don't skip the revision step even for minor issues",
  //       "Explain the reasoning behind changes",
  //       "Great for sensitive topics and high-stakes communications",
  //     ],
  //   },
  //   {
  //     id: "tool-use",
  //     name: "Tool Use & Function Calling",
  //     description: "Integrate external tools, APIs, and functions for enhanced capabilities",
  //     icon: <Zap className="h-5 w-5" />,
  //     category: "Advanced",
  //     difficulty: "Advanced",
  //     useCase: "When you need to perform actions beyond text generation (calculations, API calls, etc.)",
  //     template: `Available Tools:
  // - calculator(expression): Perform mathematical calculations
  // - web_search(query): Search the internet for current information
  // - code_executor(code, language): Execute code in specified language
  // - api_call(endpoint, method, data): Make HTTP requests to APIs
  // - file_reader(path): Read file contents
  // - data_analyzer(data, analysis_type): Analyze datasets
  //
  // Task: [your_task]
  //
  // I'll solve this by using the appropriate tools. Let me break this down:
  //
  // 1. Analysis: [what_tools_are_needed]
  // 2. Execution Plan: [step_by_step_tool_usage]
  // 3. Tool Calls:
  //
  // [tool_name]([parameters])
  // Result: [tool_output]
  //
  // [tool_name]([parameters])
  // Result: [tool_output]
  //
  // 4. Final Answer: [synthesized_result]`,
  //     examples: [
  //       {
  //         before: "What's the current stock price of Apple and how has it changed over the past month?",
  //         after: `Available Tools:
  // - web_search(query): Search for current information
  // - data_analyzer(data, analysis_type): Analyze datasets
  // - calculator(expression): Perform calculations
  //
  // Task: What's the current stock price of Apple and how has it changed over the past month?
  //
  // I'll solve this by using the appropriate tools:
  //
  // 1. Analysis: Need current stock price and historical data for comparison
  // 2. Execution Plan: Search for current price, get historical data, calculate change
  // 3. Tool Calls:
  //
  // web_search("Apple AAPL current stock price today")
  // Result: Apple (AAPL) is currently trading at $185.42
  //
  // web_search("Apple AAPL stock price one month ago historical")
  // Result: Apple was trading at $178.25 one month ago
  //
  // calculator("((185.42 - 178.25) / 178.25) * 100")
  // Result: 4.02% increase
  //
  // 4. Final Answer: Apple's current stock price is $185.42, representing a 4.02% increase from $178.25 one month ago.`,
  //         explanation:
  //           "Tool use extends AI capabilities beyond text generation to include real-world actions and data access.",
  //       },
  //     ],
  //     steps: [
  //       "Define available tools and their capabilities",
  //       "Analyze what tools are needed for the task",
  //       "Create an execution plan with tool sequence",
  //       "Make tool calls with appropriate parameters",
  //       "Synthesize results from multiple tools",
  //       "Provide a comprehensive final answer",
  //     ],
  //     tips: [
  //       "Choose the right tool for each subtask",
  //       "Handle tool errors gracefully",
  //       "Combine results from multiple tools effectively",
  //       "Validate tool outputs when possible",
  //       "Great for real-time data, calculations, and automation",
  //     ],
  //   },
  //   {
  //     id: "multi-agent",
  //     name: "Multi-Agent Prompting",
  //     description: "Simulate multiple AI agents with different roles collaborating on a task",
  //     icon: <Users className="h-5 w-5" />,
  //     category: "Advanced",
  //     difficulty: "Advanced",
  //     useCase: "For complex problems requiring diverse perspectives and expertise",
  //     template: `Task: [complex_task]
  //
  // I'll simulate multiple expert agents collaborating on this task:
  //
  // ## Agent Roles:
  // - **Agent 1 ([role_1])**: [expertise_and_perspective_1]
  // - **Agent 2 ([role_2])**: [expertise_and_perspective_2]
  // - **Agent 3 ([role_3])**: [expertise_and_perspective_3]
  // - **Moderator**: Synthesizes inputs and guides discussion
  //
  // ## Collaboration Process:
  //
  // ### Round 1: Initial Analysis
  // **[Agent_1_Name]**: [perspective_1]
  // **[Agent_2_Name]**: [perspective_2]
  // **[Agent_3_Name]**: [perspective_3]
  //
  // ### Round 2: Discussion & Debate
  // **[Agent_1_Name]**: [response_to_others]
  // **[Agent_2_Name]**: [response_to_others]
  // **[Agent_3_Name]**: [response_to_others]
  //
  // ### Round 3: Consensus Building
  // **Moderator**: [synthesis_of_viewpoints]
  // **Final Recommendation**: [collaborative_solution]`,
  //     examples: [
  //       {
  //         before: "Should our company adopt a 4-day work week?",
  //         after: `Task: Should our company adopt a 4-day work week?
  //
  // I'll simulate multiple expert agents collaborating on this task:
  //
  // ## Agent Roles:
  // - **Agent 1 (HR Director)**: Employee wellbeing and retention focus
  // - **Agent 2 (CFO)**: Financial impact and operational efficiency
  // - **Agent 3 (Operations Manager)**: Practical implementation challenges
  //
  // ## Collaboration Process:
  //
  // ### Round 1: Initial Analysis
  // **HR Director**: "4-day weeks could significantly improve employee satisfaction, reduce burnout, and help with recruitment. Studies show productivity often increases."
  //
  // **CFO**: "We need to consider reduced operational hours, potential revenue impact, and whether productivity gains offset the lost day. Customer service coverage is crucial."
  //
  // **Operations Manager**: "Implementation challenges include client expectations, project deadlines, and coordinating with vendors who operate 5-day schedules."
  //
  // ### Round 2: Discussion & Debate
  // **HR Director**: "CFO raises valid points, but employee retention savings could offset revenue concerns. Happy employees are more productive."
  //
  // **CFO**: "True, but we need pilot data. What if we trial it with non-customer-facing teams first?"
  //
  // **Operations Manager**: "A phased approach makes sense. We could start with departments that have flexible deadlines."
  //
  // ### Round 3: Consensus Building
  // **Moderator**: All agents agree on a cautious, data-driven approach.
  // **Final Recommendation**: Implement a 6-month pilot with select departments, measure productivity and satisfaction metrics, then decide on company-wide adoption.`,
  //         explanation: "Multi-agent prompting brings diverse expertise and perspectives to complex decisions.",
  //       },
  //     ],
  //     steps: [
  //       "Define 3-4 agents with distinct roles and expertise",
  //       "Have each agent provide their initial perspective",
  //       "Facilitate discussion where agents respond to each other",
  //       "Use a moderator to synthesize viewpoints",
  //       "Reach a collaborative conclusion",
  //     ],
  //     tips: [
  //       "Choose agents with genuinely different perspectives",
  //       "Allow for disagreement and debate between agents",
  //       "Use a moderator to prevent circular discussions",
  //       "Focus on reaching actionable conclusions",
  //       "Great for strategic decisions and complex analysis",
  //     ],
  //   },
  //   {
  //     id: "graph-prompting",
  //     name: "Graph Prompting",
  //     description: "Structure information and reasoning using graph relationships and connections",
  //     icon: <GitBranch className="h-5 w-5" />,
  //     category: "Advanced",
  //     difficulty: "Advanced",
  //     useCase: "For problems involving complex relationships, dependencies, or network analysis",
  //     template: `Problem: [problem_involving_relationships]
  //
  // I'll model this as a graph to understand the relationships and dependencies.
  //
  // ## Graph Structure:
  // Nodes: [list_of_entities]
  // Edges: [list_of_relationships]
  //
  // ## Graph Representation:
  // \`\`\`
  // [entity_1] --[relationship_type]--> [entity_2]
  // [entity_2] --[relationship_type]--> [entity_3]
  // [entity_3] --[relationship_type]--> [entity_1]
  // \`\`\`
  //
  // ## Graph Analysis:
  // - **Central Nodes**: [most_connected_entities]
  // - **Critical Paths**: [important_connection_sequences]
  // - **Clusters**: [groups_of_related_entities]
  // - **Bottlenecks**: [single_points_of_failure]
  //
  // ## Insights from Graph Structure:
  // [analysis_based_on_graph_properties]
  //
  // ## Solution Strategy:
  // [approach_based_on_graph_understanding]`,
  //     examples: [
  //       {
  //         before: "How can we improve communication in our organization?",
  //         after: `Problem: How can we improve communication in our organization?
  //
  // I'll model this as a graph to understand the relationships and dependencies.
  //
  // ## Graph Structure:
  // Nodes: [CEO, VPs, Directors, Managers, Teams, Individual Contributors]
  // Edges: [Reports-to, Collaborates-with, Shares-info-with, Depends-on]
  //
  // ## Graph Representation:
  // \`\`\`
  // CEO --reports-to--> Board
  // VPs --reports-to--> CEO
  // Directors --reports-to--> VPs
  // Teams --collaborates-with--> Teams
  // Projects --depends-on--> Multiple Teams
  // \`\`\`
  //
  // ## Graph Analysis:
  // - **Central Nodes**: Directors (high connectivity between upper and lower levels)
  // - **Critical Paths**: CEO → VPs → Directors → Teams
  // - **Clusters**: Department-based team clusters with weak inter-cluster connections
  // - **Bottlenecks**: Directors as information gatekeepers
  //
  // ## Insights from Graph Structure:
  // The organization has a hierarchical structure with information bottlenecks at the Director level. Cross-departmental communication is weak, creating isolated clusters.
  //
  // ## Solution Strategy:
  // 1. Strengthen cross-cluster connections (inter-departmental meetings)
  // 2. Create bypass paths around bottlenecks (skip-level meetings)
  // 3. Add horizontal connections at each level
  // 4. Implement broadcast mechanisms for company-wide updates`,
  //         explanation: "Graph prompting reveals hidden patterns and bottlenecks in complex relationship networks.",
  //       },
  //     ],
  //     steps: [
  //       "Identify entities (nodes) and relationships (edges)",
  //       "Create a visual or textual graph representation",
  //       "Analyze graph properties (centrality, clusters, paths)",
  //       "Identify critical nodes, bottlenecks, and patterns",
  //       "Develop solutions based on graph insights",
  //     ],
  //     tips: [
  //       "Use clear notation for different relationship types",
  //       "Look for patterns like clusters, bottlenecks, and central nodes",
  //       "Consider both direct and indirect connections",
  //       "Great for organizational, technical, and social problems",
  //       "Can be combined with network analysis tools",
  //     ],
  //   },
];

const categories = [
  "All",
  "Examples",
  "Reasoning",
  "Meta",
  "Quality",
  "Context",
  "Structure",
];

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
      const placeholder = `[${key}]`;
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
    alert("Copied to clipboard!");
  };

  const saveAsTemplate = () => {
    if (!isClient) return;
    // In a real app, this would save to the user's templates
    alert("Prompt saved as template!");
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
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
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
                            <div className="text-primary mt-1">
                              {technique.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm">
                                {technique.name}
                              </h3>
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
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-primary">
                              {selectedTechnique.icon}
                            </div>
                            <div>
                              <CardTitle>{selectedTechnique.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {selectedTechnique.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {selectedTechnique.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {selectedTechnique.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">When to Use</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedTechnique.useCase}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">How to Apply</h3>
                          <ol className="space-y-2">
                            {selectedTechnique.steps.map((step, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm"
                              >
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
                            {selectedTechnique.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-none" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Template</h3>
                          <div className="p-4 rounded-md border">
                            <pre className="text-sm whitespace-pre-wrap">
                              {selectedTechnique.template}
                            </pre>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(selectedTechnique.template)
                              }
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Template
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleBuildPrompt(selectedTechnique)
                              }
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Use Builder
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Before & After Examples</CardTitle>
                        <CardDescription>
                          See how applying {selectedTechnique.name} improves
                          prompt effectiveness
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {selectedTechnique.examples.map((example, index) => (
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
                                <p className="text-sm text-blue-800">
                                  {example.explanation}
                                </p>
                              </div>
                              {index <
                                selectedTechnique.examples.length - 1 && (
                                <Separator />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="builder" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Interactive Prompt Builder</CardTitle>
                        <CardDescription>
                          Build a custom prompt using the{" "}
                          {selectedTechnique.name} technique
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="user-prompt">
                              Your Original Prompt/Question
                            </Label>
                            <Textarea
                              id="user-prompt"
                              placeholder="Enter your basic prompt or question here..."
                              value={builder.userPrompt}
                              onChange={(e) =>
                                setBuilder((prev) => ({
                                  ...prev,
                                  userPrompt: e.target.value,
                                }))
                              }
                              rows={3}
                            />
                          </div>

                          {/* Dynamic parameter inputs based on technique */}
                          {selectedTechnique.id === "few-shot" && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="example-1">
                                  Example 1 (Input → Output)
                                </Label>
                                <Input
                                  id="example-1"
                                  placeholder="Input: ... → Output: ..."
                                  value={builder.parameters.example_1 || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        example_1: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="example-2">
                                  Example 2 (Input → Output)
                                </Label>
                                <Input
                                  id="example-2"
                                  placeholder="Input: ... → Output: ..."
                                  value={builder.parameters.example_2 || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        example_2: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="example-3">
                                  Example 3 (Input → Output)
                                </Label>
                                <Input
                                  id="example-3"
                                  placeholder="Input: ... → Output: ..."
                                  value={builder.parameters.example_3 || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        example_3: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {selectedTechnique.id === "role-prompting" && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="role">Role/Profession</Label>
                                <Input
                                  id="role"
                                  placeholder="e.g., experienced software engineer, marketing expert"
                                  value={builder.parameters.role || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        role: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="years">
                                  Years of Experience
                                </Label>
                                <Input
                                  id="years"
                                  placeholder="e.g., 10"
                                  value={builder.parameters.years || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        years: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="field">
                                  Field/Specialization
                                </Label>
                                <Input
                                  id="field"
                                  placeholder="e.g., web development, digital marketing"
                                  value={builder.parameters.field || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        field: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="key_traits">Key Traits</Label>
                                <Input
                                  id="key_traits"
                                  placeholder="e.g., detail-oriented, practical approach"
                                  value={builder.parameters.key_traits || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        key_traits: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {selectedTechnique.id === "constraint-prompting" && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="length">
                                  Length Constraint
                                </Label>
                                <Input
                                  id="length"
                                  placeholder="e.g., Maximum 200 words, 3 paragraphs"
                                  value={builder.parameters.length || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        length: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="format">
                                  Format Requirements
                                </Label>
                                <Input
                                  id="format"
                                  placeholder="e.g., Bullet points, numbered list, table"
                                  value={builder.parameters.format || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        format: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="style">Style/Tone</Label>
                                <Input
                                  id="style"
                                  placeholder="e.g., Professional, casual, technical"
                                  value={builder.parameters.style || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        style: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="audience">
                                  Target Audience
                                </Label>
                                <Input
                                  id="audience"
                                  placeholder="e.g., Beginners, experts, general public"
                                  value={builder.parameters.audience || ""}
                                  onChange={(e) =>
                                    setBuilder((prev) => ({
                                      ...prev,
                                      parameters: {
                                        ...prev.parameters,
                                        audience: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={generatePrompt}
                            className="w-full"
                            disabled={!builder.userPrompt}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Generate Enhanced Prompt
                          </Button>
                        </div>

                        {builder.generatedPrompt && (
                          <div className="space-y-4">
                            <Separator />
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium">
                                  Generated Prompt
                                </h3>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(builder.generatedPrompt)
                                    }
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={saveAsTemplate}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Save as Template
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href="/chat">
                                      <ArrowRight className="h-4 w-4 mr-2" />
                                      Test in Chat
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                                <pre className="text-sm whitespace-pre-wrap">
                                  {builder.generatedPrompt}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
