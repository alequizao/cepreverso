'use server';
/**
 * @fileOverview Handles reverse CEP search using ViaCEP API.
 *
 * - reverseCEPSearch - A function that handles the reverse CEP search process.
 * - ReverseCEPSearchInput - The input type for the reverseCEPSearch function.
 * - ReverseCEPSearchOutput - The return type for the reverseCEPSearch function.
 */

import {z} from 'genkit';

const ReverseCEPSearchInputSchema = z.object({
  streetName: z.string().describe('The name of the street.'),
  // neighborhood: z.string().describe('The neighborhood of the street.'), // Neighborhood is not directly used by this ViaCEP endpoint
  city: z.string().describe('The city of the street.'),
  uf: z.string().min(2, { message: "UF é obrigatório e deve ter 2 caracteres." }).max(2, { message: "UF deve ter 2 caracteres." }).describe('The state abbreviation (UF), e.g., SP.'),
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
  try {
    // Validate input using Zod schema
    const validatedInput = ReverseCEPSearchInputSchema.parse(input);
    const { uf, city, streetName } = validatedInput;

    if (streetName.length < 3) {
        // ViaCEP requires at least 3 characters for street name search
        return [];
    }

    const apiUrl = `https://viacep.com.br/ws/${uf.toUpperCase()}/${encodeURIComponent(city)}/${encodeURIComponent(streetName)}/json/`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
      console.error(`ViaCEP API request failed with status ${response.status}: ${await response.text()}`);
      // Potentially throw an error or return empty based on how you want to handle HTTP errors
      return []; // Or throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(item => ({
        cep: item.cep,
        streetName: item.logradouro,
      })).filter(item => item.cep && item.streetName); // Ensure essential fields are present
    } else if (data && data.erro === true) {
      // ViaCEP indicates "no results found" with an object like {"erro": true} for some queries,
      // although for street search, it usually returns an empty array. This handles both.
      return [];
    } else {
      // Unexpected response format
      console.error('Unexpected response format from ViaCEP:', data);
      return [];
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Input validation error:', error.errors);
      // Handle validation error appropriately, maybe rethrow or return specific error structure
      throw new Error('Invalid input for CEP search.');
    }
    console.error('Error during reverse CEP search with ViaCEP:', error);
    // Depending on how you want to surface errors to the UI, you might throw or return empty
    return []; // Or throw error;
  }
}
