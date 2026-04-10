'use server';

/**
 * @fileOverview This file defines a Genkit flow that intelligently maps spreadsheet headers to task fields using AI.
 *
 * - intelligentlyMapSpreadsheetHeaders - A function that orchestrates the AI-powered header mapping.
 * - IntelligentlyMapSpreadsheetHeadersInput - The input type for the intelligentlyMapSpreadsheetHeaders function.
 * - IntelligentlyMapSpreadsheetHeadersOutput - The return type for the intelligentlyMapSpreadsheetHeaders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentlyMapSpreadsheetHeadersInputSchema = z.object({
  headers: z.array(z.string()).describe('The headers of the spreadsheet.'),
  sampleRows: z.array(z.array(z.string())).describe('Sample rows from the spreadsheet.'),
});
export type IntelligentlyMapSpreadsheetHeadersInput = z.infer<typeof IntelligentlyMapSpreadsheetHeadersInputSchema>;

const IntelligentlyMapSpreadsheetHeadersOutputSchema = z.object({
  title: z.string().optional().describe('The column header that should be used as the task title.'),
  notes: z.string().optional().describe('The column header that should be used as the task notes.'),
  dueDate: z.string().optional().describe('The column header that should be used as the task due date.'),
  priority: z.string().optional().describe('The column header that should be used as the task priority.'),
  status: z.string().optional().describe('The column header that should be used as the task status.'),
  parentTask: z.string().optional().describe('The column header that should be used as the parent task.'),
});
export type IntelligentlyMapSpreadsheetHeadersOutput = z.infer<typeof IntelligentlyMapSpreadsheetHeadersOutputSchema>;

export async function intelligentlyMapSpreadsheetHeaders(
  input: IntelligentlyMapSpreadsheetHeadersInput
): Promise<IntelligentlyMapSpreadsheetHeadersOutput> {
  return intelligentlyMapSpreadsheetHeadersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentlyMapSpreadsheetHeadersPrompt',
  input: {schema: IntelligentlyMapSpreadsheetHeadersInputSchema},
  output: {schema: IntelligentlyMapSpreadsheetHeadersOutputSchema},
  prompt: `Given the following spreadsheet headers and sample rows, determine the best mapping for task fields.

Headers: {{{headers}}}

Sample Rows:
{{#each sampleRows}}
  {{{this}}}
{{/each}}

Consider the following task fields:
- Title: The main title or name of the task.
- Notes: Any additional information or description for the task.
- Due Date: The date when the task is due.
- Priority: The importance or urgency of the task.
- Status: The current state of the task (e.g., To Do, In Progress, Done).
- Parent Task: The task that this task is a subtask of.

Map each task field to the most appropriate column header. If a task field cannot be confidently mapped, leave it blank.

Output a JSON object with the mapping. Do not include any explanation text. Just the JSON.
`,
});

const intelligentlyMapSpreadsheetHeadersFlow = ai.defineFlow(
  {
    name: 'intelligentlyMapSpreadsheetHeadersFlow',
    inputSchema: IntelligentlyMapSpreadsheetHeadersInputSchema,
    outputSchema: IntelligentlyMapSpreadsheetHeadersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
