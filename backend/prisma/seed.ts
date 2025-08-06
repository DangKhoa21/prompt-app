import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

// TODO: Seed more data for techniques and configs
async function main() {
  // Create an admin user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
    },
  });

  console.log('Admin user created or found:', user);

  const adminRole = await prisma.role.upsert({
    where: { role: 'Admin' },
    update: {},
    create: {
      role: 'Admin',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { role: 'User' },
    update: {},
    create: {
      role: 'User',
    },
  });
  console.log('Roles created or found:', [adminRole, userRole]);

  // Assign roles to the admin user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  const prompts = [
    {
      title: 'Zero‑Shot Prompting',
      description:
        'Directly instruct the model to perform a task without using examples (no context).',
      stringTemplate: `{{Instruction}}\n\n{{Task Description}}\n\nOutput:`,
      systemInstruction:
        'Respond based purely on the instruction without examples or demonstrations.',
      tags: ['ai', 'techniques', 'zero-shot'],
      configs: [
        { label: 'Instruction', type: 'textarea' },
        { label: 'Task Description', type: 'textarea' },
      ],
    },
    {
      title: 'Few‑Shot Prompting',
      description:
        'Provide a few examples so the model understands the format and style.',
      stringTemplate: `{{Task Instruction}}\n\nExamples:\n{{Examples}}\n\nNow you do:\nInput: {{User Input}}\nOutput:`,
      systemInstruction: 'Mimic the format and style shown in the examples.',
      tags: ['ai', 'techniques', 'few-shot'],
      configs: [
        { label: 'Task Instruction', type: 'textarea' },
        {
          label: 'Examples',
          type: 'array',
          values: [
            'Input: ...\nOutput: ...',
            'Input: ...\nOutput: ...',
            'Input: ...\nOutput: ...',
          ],
        },
        { label: 'User Input', type: 'textarea' },
      ],
    },
    {
      title: 'Chain of Thought',
      description:
        'Prompt the model to reason step‑by‑step before giving an answer.',
      stringTemplate: `{{Problem}}\n\nLet's think through this step by step:\n\n{{Reasoning Steps}}\n\nFinal answer:`,
      systemInstruction:
        'List each reasoning step clearly before the final answer.',
      tags: ['ai', 'techniques', 'reasoning'],
      configs: [
        { label: 'Problem', type: 'textarea' },
        {
          label: 'Reasoning Steps',
          type: 'array',
          values: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        },
      ],
    },
    {
      title: 'Meta Prompting',
      description: 'Use AI to critique and refine a prompt itself.',
      stringTemplate: `I want to generate a prompt for the task: {{Task}}\n\nCurrent prompt:\n"{{Current Prompt}}"\n\nPlease analyze and suggest improvements in clarity, structure, completeness.`,
      systemInstruction:
        'Evaluate prompt quality and propose a better version.',
      tags: ['ai', 'techniques', 'meta'],
      configs: [
        { label: 'Task', type: 'textarea' },
        { label: 'Current Prompt', type: 'textarea' },
      ],
    },
    {
      title: 'Self‑Reflection',
      description: 'AI reviews and improves its own response.',
      stringTemplate: `Request: {{Request}}\n\nResponse:\n\n{{AI Response}}\n\nPlease:\n1. Review for accuracy\n2. Suggest improvements\n3. Revise if needed\n4. Rate your confidence (1–10)`,
      systemInstruction:
        'Reflect on your answer and provide revisions with a confidence score.',
      tags: ['ai', 'techniques', 'quality'],
      configs: [
        { label: 'Request', type: 'textarea' },
        { label: 'AI Response', type: 'textarea' },
      ],
    },
    {
      title: 'Role Prompting',
      description: 'Assign a specific persona or role to the AI.',
      stringTemplate: `You are a {{Role}} with {{Experience}} years in {{Field}}, known for {{Traits}}.\n\nPrompt: {{Prompt}}\n\nPlease respond in character.`,
      systemInstruction:
        'Embody that role’s tone, jargon, and style in your answer.',
      tags: ['ai', 'techniques', 'context'],
      configs: [
        { label: 'Role', type: 'combobox' },
        { label: 'Experience', type: 'dropdown' },
        { label: 'Field', type: 'textarea' },
        {
          label: 'Traits',
          type: 'array',
          values: [
            'Clear communicator',
            'Expert knowledge',
            'Concise',
            'Empathetic',
          ],
        },
        { label: 'Prompt', type: 'textarea' },
      ],
    },
    {
      title: 'Constraint Prompting',
      description:
        'Force output to meet specific structural or stylistic constraints.',
      stringTemplate: `{{Request}}\n\nConstraints:\n- Length: {{Length Limit}}\n- Format: {{Format}}\n- Style: {{Style}}\n- Audience: {{Audience}}\nAdditional: {{Additional Requirements}}`,
      systemInstruction:
        'Strictly follow the listed structural and stylistic constraints.',
      tags: ['ai', 'techniques', 'structure'],
      configs: [
        { label: 'Request', type: 'textarea' },
        { label: 'Length Limit', type: 'dropdown' },
        { label: 'Format', type: 'combobox' },
        { label: 'Style', type: 'textarea' },
        { label: 'Audience', type: 'textarea' },
        {
          label: 'Additional Requirements',
          type: 'array',
          values: [
            'No jargon',
            'Include example',
            'Bullet list',
            'Neutral tone',
          ],
        },
      ],
    },
    {
      title: 'RAG (Retrieval‑Augmented Generation)',
      description:
        'Use retrieval context to generate grounded, factual responses.',
      stringTemplate: `Context:\n{{Context}}\n\nQuestion: {{Query}}\n\nAnswer using only the context. Cite sources; state if data is insufficient.`,
      systemInstruction:
        'Use only the provided context and cite explicitly; do not hallucinate facts.',
      tags: ['ai', 'techniques', 'retrieval', 'rag'],
      configs: [
        { label: 'Context', type: 'textarea' },
        { label: 'Query', type: 'textarea' },
      ],
    },
    {
      title: 'Meta Prompting',
      description:
        'Use abstract task-agnostic scaffolding to structure prompts efficiently.',
      stringTemplate: `Task description: {{Task}}\n\nPlease generate a prompt template that captures the structural flow without concrete content.`,
      systemInstruction:
        'Create a high-level, content-agnostic scaffold for prompting tasks.',
      tags: ['ai', 'techniques', 'meta'],
      configs: [{ label: 'Task', type: 'textarea' }],
    },
    {
      title: 'Self‑Consistency',
      description:
        'Run multiple reasoning paths (CoT) and pick the most consistent answer.',
      stringTemplate: `Question: {{Question}}\n\nGenerate multiple reasoning chains independently, then select the final answer that appears most frequently.`,
      systemInstruction:
        'Produce at least 3 distinct Chain-of‑Thought paths and output the most consistent final answer.',
      tags: ['ai', 'techniques', 'reasoning', 'consistency'],
      configs: [
        { label: 'Question', type: 'textarea' },
        {
          label: 'Chains',
          type: 'array',
          values: ['Chain 1', 'Chain 2', 'Chain 3'],
        },
      ],
    },
    // {
    //   title: 'Tree of Thought (ToT)',
    //   description:
    //     'Explore multiple parallel reasoning paths with backtracking and self-evaluation.',
    //   stringTemplate: `Problem: {{problem}}\n\nAt each step, propose multiple thought candidates, self-evaluate them, and explore further promising branches.`,
    //   systemInstruction:
    //     'Use branching exploration: generate candidates, evaluate (“sure/maybe/impossible”), backtrack as needed.',
    //   tags: ['ai', 'techniques', 'reasoning', 'tree-of-thought'],
    //   configs: [
    //     { label: 'problem', type: 'textarea' },
    //     {
    //       label: 'candidates_per_step',
    //       type: 'dropdown',
    //     },
    //     {
    //       label: 'thought_steps',
    //       type: 'array',
    //       values: ['Thought 1', 'Thought 2', 'Thought 3'],
    //     },
    //   ],
    // },
    // {
    //   title: 'Prompt Chaining',
    //   description:
    //     'Break complex tasks into sequential prompts—output of one used as input to next.',
    //   stringTemplate: `Step 1: {{step1_prompt}}\n\nStep 2 (use output from step 1): {{step2_prompt}}\n\nContinue until final answer.`,
    //   systemInstruction:
    //     'Chain prompts logically so each stage builds on previous output.',
    //   tags: ['ai', 'techniques', 'chaining'],
    //   configs: [
    //     {
    //       label: 'step1_prompt',
    //       type: 'textarea',
    //     },
    //     {
    //       label: 'step2_prompt',
    //       type: 'textarea',
    //     },
    //     {
    //       label: 'additional_steps',
    //       type: 'array',
    //       values: ['Step 3', 'Step 4'],
    //     },
    //   ],
    // },
    {
      title: 'Write For Me',
      description:
        'Assist in writing various forms of content tailored to a specific audience and style.',
      stringTemplate:
        'Write a {{Tone}} {{Length}} {{Style}} piece of content for a {{Audience}}. The main content will be about: {{Content}}',
      tags: ['writing', 'content'],
      configs: [
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Formal', 'Casual', 'Humorous', 'Inspiring'],
        },
        {
          label: 'Length',
          type: 'dropdown',
          values: ['Short', 'Medium', 'Long'],
        },
        {
          label: 'Style',
          type: 'dropdown',
          values: ['Professional', 'Narrative', 'Expository'],
        },
        {
          label: 'Audience',
          type: 'dropdown',
          values: ['General Public', 'Technical Experts', 'Students'],
        },
        { label: 'Content', type: 'textarea' },
      ],
    },
    {
      title: 'Blog Outline Generator',
      description:
        'Generate structured blog outlines for various topics and purposes.',
      stringTemplate:
        'Create a blog outline about: {{Topic}}. Intended audience: {{Audience}}. Writing tone: {{Tone}}.',
      tags: ['writing', 'blogging'],
      configs: [
        { label: 'Topic', type: 'textarea' },
        {
          label: 'Audience',
          type: 'dropdown',
          values: ['Beginners', 'Intermediate', 'Experts'],
        },
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Educational', 'Conversational', 'Entertaining'],
        },
      ],
    },
    {
      title: 'Translate',
      description: 'Translate text into a specified target language.',
      stringTemplate:
        'Translate the following text: {{Content}}\nTarget Language: {{Language}}',
      tags: ['translation', 'language'],
      configs: [
        { label: 'Content', type: 'textarea' },
        {
          label: 'Language',
          type: 'dropdown',
          values: [
            'English',
            'Spanish',
            'French',
            'Japanese',
            'Korean',
            'German',
          ],
        },
      ],
    },
    {
      title: 'Email Generator',
      description:
        'Generate a personalized email based on your intent and recipient.',
      stringTemplate:
        'Write an email to {{Recipient}} with the following intent: {{Intent}}\nTone: {{Tone}}',
      tags: ['communication', 'productivity'],
      configs: [
        {
          label: 'Recipient',
          type: 'dropdown',
          values: ['Colleague', 'Client', 'Friend'],
        },
        { label: 'Intent', type: 'textarea' },
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Formal', 'Friendly', 'Apologetic', 'Persuasive'],
        },
      ],
    },
    {
      title: 'Product Description Generator',
      description:
        'Generate engaging product descriptions for eCommerce listings.',
      stringTemplate:
        'Write a {{Tone}} product description for the following product: {{Product}}\nKey features: {{Features}}',
      tags: ['marketing', 'ecommerce'],
      configs: [
        { label: 'Product', type: 'textarea' },
        { label: 'Features', type: 'textarea' },
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Professional', 'Excited', 'Friendly'],
        },
      ],
    },
    {
      title: 'Explain Like I’m 5',
      description:
        'Simplify complex concepts for a very young or beginner audience.',
      stringTemplate:
        'Explain the concept of {{Concept}} in a way a 5-year-old can understand.',
      tags: ['education', 'simplify'],
      configs: [{ label: 'Concept', type: 'textarea' }],
    },
    {
      title: 'Marketing Campaign Brief Generator',
      description: 'Generate a short creative brief for a marketing campaign.',
      stringTemplate:
        'Create a marketing brief for the following product/service: {{Product}}. Objective: {{Objective}}. Target Audience: {{Audience}}. Tone: {{Tone}}',
      tags: ['marketing', 'business'],
      configs: [
        { label: 'Product', type: 'textarea' },
        { label: 'Objective', type: 'textarea' },
        {
          label: 'Audience',
          type: 'dropdown',
          values: ['Teens', 'Professionals', 'Parents', 'Entrepreneurs'],
        },
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Excited', 'Confident', 'Playful', 'Urgent'],
        },
      ],
    },
    {
      title: 'Bug Report to Developer',
      description:
        'Convert a user complaint into a structured technical bug report.',
      stringTemplate:
        'User complaint: {{Complaint}}\nSummarize and structure a bug report that includes: Steps to reproduce, Expected behavior, Actual behavior, and Environment.',
      tags: ['devtools', 'bug-report', 'support'],
      configs: [{ label: 'Complaint', type: 'textarea' }],
    },
    {
      title: 'Code Review Comment Generator',
      description: 'Generate polite and helpful code review comments.',
      stringTemplate:
        'Code snippet:\n{{Code}}\nDescribe issues and suggestions in a helpful tone.',
      tags: ['developer', 'code-review'],
      configs: [{ label: 'Code', type: 'textarea' }],
    },
    {
      title: 'Customer Service Response Generator',
      description:
        'Write a professional response to a customer complaint or inquiry.',
      stringTemplate:
        'Customer message: {{Message}}\nResponse tone: {{Tone}}\nInclude apology if needed: {{Apology}}',
      tags: ['customer-service', 'business'],
      configs: [
        { label: 'Message', type: 'textarea' },
        {
          label: 'Tone',
          type: 'dropdown',
          values: ['Empathetic', 'Professional', 'Apologetic', 'Friendly'],
        },
        { label: 'Apology', type: 'dropdown', values: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Legal Disclaimer Generator',
      description:
        'Generate a basic legal disclaimer for your content or website.',
      stringTemplate:
        'Generate a {{Type}} disclaimer for the following context: {{Context}}. Intended audience: {{Audience}}',
      tags: ['legal', 'compliance'],
      configs: [
        {
          label: 'Type',
          type: 'dropdown',
          values: ['Medical', 'Financial', 'General Content', 'Affiliate'],
        },
        { label: 'Context', type: 'textarea' },
        {
          label: 'Audience',
          type: 'dropdown',
          values: ['General Public', 'US Visitors', 'EU Visitors'],
        },
      ],
    },
    {
      title: 'Job Interview Questions Generator',
      description:
        'Create interview questions based on job role and required skills.',
      stringTemplate:
        'Generate {{Count}} interview questions for the position of {{Role}}. Focus areas: {{FocusAreas}}',
      tags: ['hiring', 'hr', 'interview'],
      configs: [
        { label: 'Count', type: 'dropdown', values: ['5', '10', '15'] },
        { label: 'Role', type: 'textarea' },
        { label: 'FocusAreas', type: 'textarea' },
      ],
    },
    {
      title: 'Self-Reflection Debugging',
      description:
        'Have the AI reflect on its previous answer and suggest improvements.',
      stringTemplate:
        'Previous output: {{Output}}\nReflect on potential weaknesses or mistakes and suggest improvements.',
      tags: ['ai', 'self-reflection', 'debugging'],
      configs: [{ label: 'Output', type: 'textarea' }],
    },
    {
      title: 'Meta Prompt Analyzer',
      description:
        'Analyze and optimize a user-written prompt for clarity and effectiveness.',
      stringTemplate:
        'Analyze the following prompt: {{Prompt}}\nProvide suggestions to improve specificity, clarity, or structure.',
      tags: ['ai', 'meta-prompting', 'prompt-engineering'],
      configs: [{ label: 'Prompt', type: 'textarea' }],
    },
    {
      title: 'Directional Stimulus Prompting',
      description:
        'Guide AI with specific directions and desired output format.',
      stringTemplate:
        'Task: {{Task}}\nMake sure to follow this format: {{Format}}\nEmphasize: {{Emphasis}}',
      tags: ['ai', 'stimulus', 'formatting'],
      configs: [
        { label: 'Task', type: 'textarea' },
        { label: 'Format', type: 'textarea' },
        { label: 'Emphasis', type: 'textarea' },
      ],
    },
    {
      title: 'Multiple Persona Debate',
      description:
        'Have AI argue multiple perspectives on a topic to explore different viewpoints.',
      stringTemplate:
        'Topic: {{Topic}}\nPersona 1: {{Persona1}}\nPersona 2: {{Persona2}}\nConduct a debate between these personas.',
      tags: ['ai', 'debate', 'reasoning'],
      configs: [
        { label: 'Topic', type: 'textarea' },
        { label: 'Persona1', type: 'textarea' },
        { label: 'Persona2', type: 'textarea' },
      ],
    },
    {
      title: 'Recursive Self-Improvement',
      description:
        'AI recursively evaluates its own output to improve quality step-by-step.',
      stringTemplate:
        'Initial answer: {{InitialAnswer}}\nEvaluate the weaknesses and refine the answer.',
      tags: ['ai', 'recursive-improvement'],
      configs: [{ label: 'InitialAnswer', type: 'textarea' }],
    },
    {
      title: 'Role-Based Assistant',
      description:
        'Define a specific role for the AI agent to adopt while performing tasks.',
      stringTemplate:
        'You are acting as a {{Role}}. Your task is: {{Task}}. Stay fully within this role while answering.',
      tags: ['ai-agent', 'roleplay', 'context'],
      configs: [
        { label: 'Role', type: 'textarea' },
        { label: 'Task', type: 'textarea' },
      ],
    },
    {
      title: 'Knowledge Gap Identifier',
      description:
        'Identify areas where the information provided is insufficient or ambiguous.',
      stringTemplate:
        'Input: {{InputText}}\nList any missing information, gaps, or assumptions required for better output.',
      tags: ['ai-agent', 'clarity', 'gap-analysis'],
      configs: [{ label: 'InputText', type: 'textarea' }],
    },
    {
      title: 'User Intent Clarifier',
      description:
        'Ask follow-up clarifying questions to better understand user intent before generating output.',
      stringTemplate:
        'User Request: {{Request}}\nIdentify unclear areas and ask up to 3 clarifying questions.',
      tags: ['ai-agent', 'clarity', 'intent-detection'],
      configs: [{ label: 'Request', type: 'textarea' }],
    },
    {
      title: 'Constraint Enforcer',
      description:
        'Verify that outputs comply with given constraints and guidelines.',
      stringTemplate:
        'Generated Output: {{Output}}\nConstraints: {{Constraints}}\nCheck if output fully complies and suggest corrections if needed.',
      tags: ['ai-agent', 'validation', 'constraints'],
      configs: [
        { label: 'Output', type: 'textarea' },
        { label: 'Constraints', type: 'textarea' },
      ],
    },
    {
      title: 'Output Quality Evaluator',
      description:
        'Assess the quality, completeness, and helpfulness of the AI’s own response.',
      stringTemplate:
        'Output to evaluate: {{Output}}\nRate quality on scale 1-10, and suggest improvements.',
      tags: ['ai-agent', 'self-evaluation', 'reflection'],
      configs: [{ label: 'Output', type: 'textarea' }],
    },
    {
      title: 'Task Planner',
      description: 'Break a complex task into smaller, manageable steps.',
      stringTemplate:
        'Task: {{TaskDescription}}\nCreate a step-by-step plan to accomplish it.',
      tags: ['ai-agent', 'planning', 'reasoning'],
      configs: [{ label: 'TaskDescription', type: 'textarea' }],
    },
    {
      title: 'Persona Simulator',
      description:
        'Simulate a target audience to evaluate content appropriateness.',
      stringTemplate:
        'Simulate persona: {{Persona}}\nEvaluate if the following content is suitable for this persona: {{Content}}',
      tags: ['ai-agent', 'persona', 'simulation'],
      configs: [
        { label: 'Persona', type: 'textarea' },
        { label: 'Content', type: 'textarea' },
      ],
    },
    {
      title: 'Reasoning Trace Agent',
      description:
        'Log every reasoning step clearly while solving complex problems.',
      stringTemplate:
        'Problem: {{Problem}}\nTrace your full reasoning path step-by-step and highlight key decisions.',
      tags: ['ai-agent', 'reasoning', 'cot'],
      configs: [{ label: 'Problem', type: 'textarea' }],
    },
    {
      title: 'Multi-Agent Delegation',
      description:
        'Divide a task into sub-tasks handled by different specialized agents.',
      stringTemplate:
        'Main Task: {{MainTask}}\nDefine agents and sub-tasks for delegation.',
      tags: ['ai-agent', 'multi-agent', 'decomposition'],
      configs: [{ label: 'MainTask', type: 'textarea' }],
    },
  ];

  for (const data of prompts) {
    const prompt = await prisma.prompt.create({
      data: {
        title: data.title,
        description: data.description,
        stringTemplate: data.stringTemplate,
        creatorId: user.id,
      },
    });

    for (const tagName of data.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });

      await prisma.promptTag.create({
        data: {
          promptId: prompt.id,
          tagId: tag.id,
        },
      });
    }

    for (const config of data.configs) {
      const configEntry = await prisma.promptConfig.create({
        data: {
          promptId: prompt.id,
          label: config.label,
          type: config.type,
        },
      });

      if (config.values) {
        for (const value of config.values) {
          await prisma.configValue.create({
            data: {
              promptConfigId: configEntry.id,
              value,
            },
          });
        }
      }
    }

    await prisma.star.create({
      data: {
        userId: user.id,
        promptId: prompt.id,
      },
    });

    console.log(`Prompt seeded: ${prompt.title}`);
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
