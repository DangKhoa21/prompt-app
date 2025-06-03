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
      title: 'Write For Me',
      description: 'Assist in writing various forms of content tailored to a specific audience and style.',
      stringTemplate:
        'Write a ${Tone} ${Length} ${Style} piece of content for a ${Audience}. The main content will be about: ${Content}',
      tags: ['writing', 'content'],
      configs: [
        { label: 'Tone', type: 'dropdown', values: ['Formal', 'Casual', 'Humorous', 'Inspiring'] },
        { label: 'Length', type: 'dropdown', values: ['Short', 'Medium', 'Long'] },
        { label: 'Style', type: 'dropdown', values: ['Professional', 'Narrative', 'Expository'] },
        { label: 'Audience', type: 'dropdown', values: ['General Public', 'Technical Experts', 'Students'] },
        { label: 'Content', type: 'textarea' },
      ],
    },
    {
      title: 'Blog Outline Generator',
      description: 'Generate structured blog outlines for various topics and purposes.',
      stringTemplate:
        'Create a blog outline about: ${Topic}. Intended audience: ${Audience}. Writing tone: ${Tone}.',
      tags: ['writing', 'blogging'],
      configs: [
        { label: 'Topic', type: 'textarea' },
        { label: 'Audience', type: 'dropdown', values: ['Beginners', 'Intermediate', 'Experts'] },
        { label: 'Tone', type: 'dropdown', values: ['Educational', 'Conversational', 'Entertaining'] },
      ],
    },
    {
      title: 'Few-shot Prompting',
      description: 'Demonstrate tasks with examples to guide AI outputs using few-shot learning.',
      stringTemplate: 'Examples: ${Example}\nNow perform this task: ${Task}',
      tags: ['ai', 'techniques'],
      configs: [
        { label: 'Example', type: 'textarea' },
        { label: 'Task', type: 'textarea' },
      ],
    },
    {
      title: 'Chain of Thought Reasoning',
      description: 'Prompt for step-by-step thinking and logical reasoning.',
      stringTemplate: 'Problem: ${Problem}\nLet\'s think step-by-step: ${Step}',
      tags: ['ai', 'reasoning'],
      configs: [
        { label: 'Problem', type: 'textarea' },
        { label: 'Step', type: 'textarea' },
      ],
    },
    {
      title: 'Translate',
      description: 'Translate text into a specified target language.',
      stringTemplate:
        'Translate the following text: ${Content}\nTarget Language: ${Language}',
      tags: ['translation', 'language'],
      configs: [
        { label: 'Content', type: 'textarea' },
        { label: 'Language', type: 'dropdown', values: ['English', 'Spanish', 'French', 'Japanese', 'Korean', 'German'] },
      ],
    },
    {
      title: 'Email Generator',
      description: 'Generate a personalized email based on your intent and recipient.',
      stringTemplate:
        'Write an email to ${Recipient} with the following intent: ${Intent}\nTone: ${Tone}',
      tags: ['communication', 'productivity'],
      configs: [
        { label: 'Recipient', type: 'dropdown', values: ['Colleague', 'Client', 'Friend'] },
        { label: 'Intent', type: 'textarea' },
        { label: 'Tone', type: 'dropdown', values: ['Formal', 'Friendly', 'Apologetic', 'Persuasive'] },
      ],
    },
    {
      title: 'Product Description Generator',
      description: 'Generate engaging product descriptions for eCommerce listings.',
      stringTemplate:
        'Write a ${Tone} product description for the following product: ${Product}\nKey features: ${Features}',
      tags: ['marketing', 'ecommerce'],
      configs: [
        { label: 'Product', type: 'textarea' },
        { label: 'Features', type: 'textarea' },
        { label: 'Tone', type: 'dropdown', values: ['Professional', 'Excited', 'Friendly'] },
      ],
    },
    {
      title: 'Explain Like I’m 5',
      description: 'Simplify complex concepts for a very young or beginner audience.',
      stringTemplate:
        'Explain the concept of ${Concept} in a way a 5-year-old can understand.',
      tags: ['education', 'simplify'],
      configs: [
        { label: 'Concept', type: 'textarea' },
      ],
    },
    {
      title: 'Marketing Campaign Brief Generator',
      description: 'Generate a short creative brief for a marketing campaign.',
      stringTemplate:
        'Create a marketing brief for the following product/service: ${Product}. Objective: ${Objective}. Target Audience: ${Audience}. Tone: ${Tone}',
      tags: ['marketing', 'business'],
      configs: [
        { label: 'Product', type: 'textarea' },
        { label: 'Objective', type: 'textarea' },
        { label: 'Audience', type: 'dropdown', values: ['Teens', 'Professionals', 'Parents', 'Entrepreneurs'] },
        { label: 'Tone', type: 'dropdown', values: ['Excited', 'Confident', 'Playful', 'Urgent'] },
      ],
    },
    {
      title: 'Bug Report to Developer',
      description: 'Convert a user complaint into a structured technical bug report.',
      stringTemplate:
        'User complaint: ${Complaint}\nSummarize and structure a bug report that includes: Steps to reproduce, Expected behavior, Actual behavior, and Environment.',
      tags: ['devtools', 'bug-report', 'support'],
      configs: [
        { label: 'Complaint', type: 'textarea' },
      ],
    },
    {
      title: 'Code Review Comment Generator',
      description: 'Generate polite and helpful code review comments.',
      stringTemplate:
        'Code snippet:\n${Code}\nDescribe issues and suggestions in a helpful tone.',
      tags: ['developer', 'code-review'],
      configs: [
        { label: 'Code', type: 'textarea' },
      ],
    },
    {
      title: 'Customer Service Response Generator',
      description: 'Write a professional response to a customer complaint or inquiry.',
      stringTemplate:
        'Customer message: ${Message}\nResponse tone: ${Tone}\nInclude apology if needed: ${Apology}',
      tags: ['customer-service', 'business'],
      configs: [
        { label: 'Message', type: 'textarea' },
        { label: 'Tone', type: 'dropdown', values: ['Empathetic', 'Professional', 'Apologetic', 'Friendly'] },
        { label: 'Apology', type: 'dropdown', values: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Legal Disclaimer Generator',
      description: 'Generate a basic legal disclaimer for your content or website.',
      stringTemplate:
        'Generate a ${Type} disclaimer for the following context: ${Context}. Intended audience: ${Audience}',
      tags: ['legal', 'compliance'],
      configs: [
        { label: 'Type', type: 'dropdown', values: ['Medical', 'Financial', 'General Content', 'Affiliate'] },
        { label: 'Context', type: 'textarea' },
        { label: 'Audience', type: 'dropdown', values: ['General Public', 'US Visitors', 'EU Visitors'] },
      ],
    },
    {
      title: 'Job Interview Questions Generator',
      description: 'Create interview questions based on job role and required skills.',
      stringTemplate:
        'Generate ${Count} interview questions for the position of ${Role}. Focus areas: ${FocusAreas}',
      tags: ['hiring', 'hr', 'interview'],
      configs: [
        { label: 'Count', type: 'dropdown', values: ['5', '10', '15'] },
        { label: 'Role', type: 'textarea' },
        { label: 'FocusAreas', type: 'textarea' },
      ],
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
