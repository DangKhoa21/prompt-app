import { tool } from 'ai';
import { z } from 'zod';

export const definedTools = {
  getWeather: tool({
    description: 'Get the current weather at a location',
    parameters: z.object({
      latitude: z.number().describe('Latitude coordinate'),
      longitude: z.number().describe('Longitude coordinate'),
    }),
    execute: async ({ latitude, longitude }, { abortSignal }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
        { signal: abortSignal },
      );

      const weatherData = await response.json();
      return weatherData;
    },
  }),
};
