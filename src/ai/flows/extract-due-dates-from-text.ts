'use server';

/**
 * @fileOverview An AI agent that extracts due dates from text.
 *
 * - extractDueDateFromText - A function that handles the due date extraction process.
 * - ExtractDueDateFromTextInput - The input type for the extractDueDateFromText function.
 * - ExtractDueDateFromTextOutput - The return type for the extractDueDateFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDueDateFromTextInputSchema = z.object({
  text: z.string().describe('The text from which to extract the due date.'),
});
export type ExtractDueDateFromTextInput = z.infer<typeof ExtractDueDateFromTextInputSchema>;

const ExtractDueDateFromTextOutputSchema = z.object({
  dueDate: z
    .string()
    .nullable()
    .describe('The extracted due date in ISO format (YYYY-MM-DD), or null if no date is found.'),
});
export type ExtractDueDateFromTextOutput = z.infer<typeof ExtractDueDateFromTextOutputSchema>;

export async function extractDueDateFromText(
  input: ExtractDueDateFromTextInput
): Promise<ExtractDueDateFromTextOutput> {
  return extractDueDateFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDueDateFromTextPrompt',
  input: {schema: ExtractDueDateFromTextInputSchema},
  output: {schema: ExtractDueDateFromTextOutputSchema},
  prompt: `You are a helpful assistant designed to extract due dates from text.

  Analyze the following text and extract the due date. If a due date is found, format it as YYYY-MM-DD.
  If no due date is found, return null.

  Text: {{{text}}}
  `,
});

const extractDueDateFromTextFlow = ai.defineFlow(
  {
    name: 'extractDueDateFromTextFlow',
    inputSchema: ExtractDueDateFromTextInputSchema,
    outputSchema: ExtractDueDateFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
