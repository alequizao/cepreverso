'use server';
/**
 * @fileOverview A reverse CEP search AI agent.
 *
 * - reverseCEPSearch - A function that handles the reverse CEP search process.
 * - ReverseCEPSearchInput - The input type for the reverseCEPSearch function.
 * - ReverseCEPSearchOutput - The return type for the reverseCEPSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseCEPSearchInputSchema = z.object({
  streetName: z.string().describe('The name of the street.'),
  neighborhood: z.string().describe('The neighborhood of the street.'),
  city: z.string().describe('The city of the street.'),
});
export type ReverseCEPSearchInput = z.infer<typeof ReverseCEPSearchInputSchema>;

const ReverseCEPSearchOutputSchema = z.array(
  z.object({
    cep: z.string().describe('The CEP code.'),
    streetName: z.string().describe('The name of the street.'),
  })
);
export type ReverseCEPSearchOutput = z.infer<typeof ReverseCEPSearchOutputSchema>;

export async function reverseCEPSearch(input: ReverseCEPSearchInput): Promise<ReverseCEPSearchOutput> {
  return reverseCEPSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reverseCEPSearchPrompt',
  input: {schema: ReverseCEPSearchInputSchema},
  output: {schema: ReverseCEPSearchOutputSchema},
  prompt: `You are an expert in Brazilian postal codes (CEP). Given the street name, neighborhood, and city, you will list the matching CEPs and street names.

Street Name: {{{streetName}}}
Neighborhood: {{{neighborhood}}}
City: {{{city}}}

List the CEPs and street names in a JSON array format. Each object in the array should have the keys \"cep\" and \"streetName\".`,
});

const reverseCEPSearchFlow = ai.defineFlow(
  {
    name: 'reverseCEPSearchFlow',
    inputSchema: ReverseCEPSearchInputSchema,
    outputSchema: ReverseCEPSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
