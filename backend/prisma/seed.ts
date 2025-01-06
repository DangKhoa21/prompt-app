import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

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

  // Create a prompt called "Write For Me"
  const prompt = await prisma.prompt.upsert({
    where: { title: 'Write For Me' },
    update: {},
    create: {
      title: 'Write For Me',
      description:
        'A prompt designed to assist in writing various forms of content.',
      stringTemplate:
        'Write a ${Tone} ${Length} ${Style} piece of content for a ${Audience}.',
      creatorId: user.id,
    },
  });
  console.log('Prompt created or found:', prompt);

  // Create tag
  const tag = await prisma.tag.upsert({
    where: { name: 'writing' },
    update: {},
    create: {
      name: 'writing',
    },
  });

  await prisma.promptTag.create({
    data: {
      promptId: prompt.id,
      tagId: tag.id,
    },
  });

  console.log('Tag created or found:', tag);

  // Create the prompt configurations
  const toneConfig = await prisma.promptConfig.upsert({
    where: { promptId: prompt.id, label: 'Tone' },
    update: {},
    create: {
      promptId: prompt.id,
      label: 'Tone',
      type: 'dropdown',
    },
  });

  const lengthConfig = await prisma.promptConfig.upsert({
    where: { promptId: prompt.id, label: 'Length' },
    update: {},
    create: {
      promptId: prompt.id,
      label: 'Length',
      type: 'dropdown',
    },
  });

  const styleConfig = await prisma.promptConfig.upsert({
    where: { promptId: prompt.id, label: 'Style' },
    update: {},
    create: {
      promptId: prompt.id,
      label: 'Style',
      type: 'dropdown',
    },
  });

  const audienceConfig = await prisma.promptConfig.upsert({
    where: { promptId: prompt.id, label: 'Audience' },
    update: {},
    create: {
      promptId: prompt.id,
      label: 'Audience',
      type: 'dropdown',
    },
  });

  console.log('Prompt configurations created or found:', [
    toneConfig,
    lengthConfig,
    styleConfig,
    audienceConfig,
  ]);

  // Create config values for each prompt configuration
  const toneValue = await prisma.configValue.create({
    data: {
      promptConfigId: toneConfig.id,
      value: 'Formal',
    },
  });
  const toneValue1 = await prisma.configValue.create({
    data: {
      promptConfigId: toneConfig.id,
      value: 'Casual',
    },
  });
  const toneValue2 = await prisma.configValue.create({
    data: {
      promptConfigId: toneConfig.id,
      value: 'Humorous',
    },
  });

  const lengthValue = await prisma.configValue.create({
    data: {
      promptConfigId: lengthConfig.id,
      value: 'Medium',
    },
  });
  const lengthValue1 = await prisma.configValue.create({
    data: {
      promptConfigId: lengthConfig.id,
      value: 'Long',
    },
  });
  const lengthValue2 = await prisma.configValue.create({
    data: {
      promptConfigId: lengthConfig.id,
      value: 'Short',
    },
  });

  const styleValue = await prisma.configValue.create({
    data: {
      promptConfigId: styleConfig.id,
      value: 'Professional',
    },
  });
  const styleValue1 = await prisma.configValue.create({
    data: {
      promptConfigId: styleConfig.id,
      value: 'Narrative',
    },
  });
  const styleValue2 = await prisma.configValue.create({
    data: {
      promptConfigId: styleConfig.id,
      value: 'Expository',
    },
  });

  const audienceValue = await prisma.configValue.create({
    data: {
      promptConfigId: audienceConfig.id,
      value: 'General Public',
    },
  });
  const audienceValue1 = await prisma.configValue.create({
    data: {
      promptConfigId: audienceConfig.id,
      value: 'Technical Experts',
    },
  });
  const audienceValue2 = await prisma.configValue.create({
    data: {
      promptConfigId: audienceConfig.id,
      value: 'Students',
    },
  });

  console.log('Config values created:', [
    toneValue,
    toneValue1,
    toneValue2,
    lengthValue,
    lengthValue1,
    lengthValue2,
    styleValue,
    styleValue1,
    styleValue2,
    audienceValue,
    audienceValue1,
    audienceValue2,
  ]);

  // User stars the "Write For Me" prompt
  const star = await prisma.star.create({
    data: {
      userId: user.id,
      promptId: prompt.id,
    },
  });

  console.log('User starred the prompt:', star);
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
