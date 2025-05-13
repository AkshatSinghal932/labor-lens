
'use server';
/**
 * @fileOverview AI flow to generate a concise headline for a labor report.
 *
 * - generateReportHeadline - A function that generates a headline for the report.
 * - GenerateReportHeadlineInput - The input type for the generateReportHeadline function.
 * - GenerateReportHeadlineOutput - The output type for the generateReportHeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportHeadlineInputSchema = z.object({
  description: z.string().describe('The detailed description of the incident.'),
  typeOfIncidence: z.string().describe('The type of labor issue reported (e.g., wage theft, safety violation).'),
  location: z.string().describe('The specific address or area where the incident occurred.'),
  city: z.string().describe('The city where the incident occurred.'),
});
export type GenerateReportHeadlineInput = z.infer<typeof GenerateReportHeadlineInputSchema>;

const GenerateReportHeadlineOutputSchema = z.object({
  headline: z.string().describe('A concise and engaging headline for the report (max 10 words).'),
});
export type GenerateReportHeadlineOutput = z.infer<typeof GenerateReportHeadlineOutputSchema>;

export async function generateReportHeadline(input: GenerateReportHeadlineInput): Promise<GenerateReportHeadlineOutput> {
  return generateReportHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportHeadlinePrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: GenerateReportHeadlineInputSchema},
  output: {schema: GenerateReportHeadlineOutputSchema},
  prompt: `Generate a concise and engaging headline (maximum 10 words, ideally 5-7 words) for a labor report with the following details. The headline should be suitable for a public dashboard, summarizing the essence of the issue.

Report Details:
Description: {{{description}}}
Type of Issue: {{{typeOfIncidence}}}
Specific Location: {{{location}}}
City: {{{city}}}

Examples of good headlines:
- "Wage Theft Alleged at Downtown Cafe"
- "Unsafe Conditions at City Factory"
- "Workers Protest Unfair Pay in Springfield"

Headline:`,
});

const generateReportHeadlineFlow = ai.defineFlow(
  {
    name: 'generateReportHeadlineFlow',
    inputSchema: GenerateReportHeadlineInputSchema,
    outputSchema: GenerateReportHeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        // Fallback in case the AI doesn't generate a headline or an error occurs
        return { headline: `Report: ${input.typeOfIncidence} in ${input.city}` };
    }
    return output;
  }
);
