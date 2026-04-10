'use server';

/**
 * @fileOverview This flow uses AI to detect duplicate tasks between a spreadsheet and a destination platform.
 *
 * - detectDuplicateTasks - A function that detects duplicate tasks using AI.
 * - DetectDuplicateTasksInput - The input type for the detectDuplicateTasks function.
 * - DetectDuplicateTasksOutput - The return type for the detectDuplicateTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDuplicateTasksInputSchema = z.object({
  spreadsheetData: z.string().describe('The spreadsheet data as a string.'),
  existingTasks: z.array(z.string()).describe('The existing tasks in the destination platform as an array of strings.'),
});
export type DetectDuplicateTasksInput = z.infer<typeof DetectDuplicateTasksInputSchema>;

const DetectDuplicateTasksOutputSchema = z.object({
  duplicateTasks: z.array(z.boolean()).describe('An array of booleans indicating whether each task in the spreadsheet is a duplicate.'),
});
export type DetectDuplicateTasksOutput = z.infer<typeof DetectDuplicateTasksOutputSchema>;

export async function detectDuplicateTasks(input: DetectDuplicateTasksInput): Promise<DetectDuplicateTasksOutput> {
  return detectDuplicateTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDuplicateTasksPrompt',
  input: {schema: DetectDuplicateTasksInputSchema},
  output: {schema: DetectDuplicateTasksOutputSchema},
  prompt: `You are an AI assistant that identifies duplicate tasks between a spreadsheet and a list of existing tasks.

  Given the following spreadsheet data:
  {{spreadsheetData}}

  And the following existing tasks:
  {{#each existingTasks}}- {{{this}}}\n{{/each}}

  Determine whether each task in the spreadsheet is a duplicate of any of the existing tasks.
  Return an array of booleans, where each boolean corresponds to a task in the spreadsheet and indicates whether it is a duplicate.
  For example, if the spreadsheet contains 3 tasks and the first and third tasks are duplicates, the output should be [true, false, true].
  The output should be a valid JSON.
  Make sure not to include any explanations or other information in the output, only the JSON.
  Make sure the tasks are compared for semantic meaning and not just string matching.
  If the user asks a question, say that you can only generate a JSON output.
  `,
});

const detectDuplicateTasksFlow = ai.defineFlow(
  {
    name: 'detectDuplicateTasksFlow',
    inputSchema: DetectDuplicateTasksInputSchema,
    outputSchema: DetectDuplicateTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
