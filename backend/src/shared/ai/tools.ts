// import { tool } from 'ai';
// import { z } from 'zod';

// export const getWeather = tool({
//   name: 'getWeather',
//   description: 'Get the current weather at a location',
//   inputSchema: z.object({
//     latitude: z.number(),
//     longitude: z.number(),
//   }),
//   execute: async ({ latitude, longitude }) => {
//     const res = await fetch(
//       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
//     );
//     const data = await res.json();
//     return `Current temperature is ${data.current.temperature_2m}°C`;
//   },
// });
