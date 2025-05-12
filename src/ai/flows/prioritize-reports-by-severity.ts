'use server';

/**
 * @fileOverview AI-powered report prioritization based on severity.
 *
 * - prioritizeReportsBySeverity - A function to prioritize reports based on severity.
 * - PrioritizeReportsBySeverityInput - The input type for the prioritizeReportsBySeverity function.
 * - PrioritizeReportsBySeverityOutput - The return type for the prioritizeReportsBySeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeReportsBySeverityInputSchema = z.object({
  reportText: z
    .string()
    .describe(
      'The text content of the labor report, detailing the alleged labor issue.'
    ),
});
export type PrioritizeReportsBySeverityInput = z.infer<
  typeof PrioritizeReportsBySeverityInputSchema
>;

const PrioritizeReportsBySeverityOutputSchema = z.object({
  severityScore: z
    .number()
    .describe(
      'A numerical score (1-10) indicating the severity of the reported labor issue, with 10 being the most severe.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the report was assigned the given severity score.'
    ),
  actionable: z.boolean().describe(
    'A boolean value, which is true when the report contains sufficient information and indicates a situation that likely violates labor laws or ethical standards, suggesting it warrants immediate review, otherwise false.'
  ),
});
export type PrioritizeReportsBySeverityOutput = z.infer<
  typeof PrioritizeReportsBySeverityOutputSchema
>;

export async function prioritizeReportsBySeverity(
  input: PrioritizeReportsBySeverityInput
): Promise<PrioritizeReportsBySeverityOutput> {
  return prioritizeReportsBySeverityFlow(input);
}

const prioritizeReportsBySeverityPrompt = ai.definePrompt({
  name: 'prioritizeReportsBySeverityPrompt',
  input: {schema: PrioritizeReportsBySeverityInputSchema},
  output: {schema: PrioritizeReportsBySeverityOutputSchema},
  prompt: `You are an AI assistant designed to evaluate the severity of labor exploitation reports. Analyze the provided report text and assign a severity score from 1 to 10 (1 being the least severe, 10 being the most severe). Also, provide a brief reasoning for the assigned score. Finally, based on whether the report contains specific, actionable information that suggests a violation of labor laws or ethical standards, determine if the report warrants immediate review (actionable = true) or not (actionable = false).

Report Text: {{{reportText}}}`,
});

const prioritizeReportsBySeverityFlow = ai.defineFlow(
  {
    name: 'prioritizeReportsBySeverityFlow',
    inputSchema: PrioritizeReportsBySeverityInputSchema,
    outputSchema: PrioritizeReportsBySeverityOutputSchema,
  },
  async input => {
    const {output} = await prioritizeReportsBySeverityPrompt(input);
    return output!;
  }
);
