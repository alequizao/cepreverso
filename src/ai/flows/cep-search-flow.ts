'use server';
/**
 * @fileOverview Handles CEP search using ViaCEP API.
 *
 * - cepSearch - A function that handles the CEP search process.
 * - CEPSearchInput - The input type for the cepSearch function.
 * - CEPSearchOutput - The return type for the cepSearch function.
 */

import { z } from 'genkit';

const CEPSearchInputSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido. Formato esperado: 00000-000 ou 00000000."),
});
export type CEPSearchInput = z.infer<typeof CEPSearchInputSchema>;

const CEPSearchOutputSchema = z.object({
  cep: z.string().describe('O código do CEP.'),
  logradouro: z.string().describe('O nome da rua/avenida/etc.'),
  complemento: z.string().optional().describe('Complemento do endereço.'),
  bairro: z.string().describe('O bairro.'),
  localidade: z.string().describe('A cidade.'),
  uf: z.string().describe('A sigla do estado (UF).'),
  ibge: z.string().optional().describe('Código IBGE do município.'),
  gia: z.string().optional().describe('Código GIA (se houver).'),
  ddd: z.string().optional().describe('Código DDD da localidade.'),
  siafi: z.string().optional().describe('Código SIAFI do município.'),
  erro: z.boolean().optional().describe('Indica se houve erro na busca (CEP não encontrado).')
}).nullable(); // ViaCEP can return null or {erro: true} for not found

export type CEPSearchOutput = z.infer<typeof CEPSearchOutputSchema>;

export async function cepSearch(input: CEPSearchInput): Promise<CEPSearchOutput> {
  try {
    const validatedInput = CEPSearchInputSchema.parse(input);
    const cep = validatedInput.cep.replace('-', ''); // Remove hyphen if present

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`ViaCEP API request failed with status ${response.status}: ${await response.text()}`);
      return null;
    }

    const data = await response.json();

    if (data.erro) {
      // Return a structure indicating the CEP was not found by the API
      return { 
        cep: validatedInput.cep, // Keep the original CEP for context if needed
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        ibge: '',
        gia: '',
        ddd: '',
        siafi: '',
        erro: true 
      };
    }
    
    // Ensure all expected fields are strings, providing defaults if necessary
    return {
      cep: data.cep || '',
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      ibge: data.ibge || '',
      gia: data.gia || '',
      ddd: data.ddd || '',
      siafi: data.siafi || '',
      erro: false,
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Input validation error:', error.errors);
      // Consider re-throwing or returning a specific error structure for Zod errors
      // For now, returning null to indicate a general failure to the frontend.
      // The frontend can then display a generic error message.
      // Or, throw new Error(`CEP inválido: ${error.errors.map(e => e.message).join(', ')}`);
      return null; 
    }
    console.error('Error during CEP search with ViaCEP:', error);
    return null; // Indicates a general error (e.g., network issue, unexpected API error)
  }
}
