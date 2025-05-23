"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search as SearchIcon } from "lucide-react"; // Renamed Search to avoid conflict
import { cepSearch, type CEPSearchOutput, type CEPSearchInput } from "@/ai/flows/cep-search-flow";
import CEPResultsCard from "./CEPResultsCard";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cep: z.string().min(8, { message: "CEP deve ter 8 ou 9 caracteres." }).max(9, { message: "CEP deve ter 8 ou 9 caracteres." })
    .regex(/^\d{5}-?\d{3}$/, { message: "Formato de CEP inválido. Use XXXXX-XXX ou XXXXXXXX." }),
});

type FormData = z.infer<typeof formSchema>;

export default function CEPForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<CEPSearchOutput | null>(null);
  const [searched, setSearched] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cep: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSearched(false);
    setResult(null);
    try {
      const searchInput: CEPSearchInput = {
        cep: values.cep,
      };
      const response = await cepSearch(searchInput);
      
      if (response && response.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado na base de dados.",
        });
        setResult(null); // Explicitly set to null if CEP not found by API
      } else if (response) {
        setResult(response);
      } else {
         // This case handles null response from cepSearch, indicating an unexpected error (e.g. network)
         toast({
          variant: "destructive",
          title: "Erro na busca",
          description: "Ocorreu um erro ao tentar consultar o CEP. Verifique sua conexão e tente novamente.",
        });
        setResult(null);
      }
      setSearched(true);
    } catch (error) { // This catch is more for client-side unexpected errors, cepSearch itself handles API/Zod errors
      console.error("Erro inesperado na busca de CEP:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      setResult(null);
      setSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    // Prevent exceeding maxLength defined in input (implicitly 9 due to mask)
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    form.setValue('cep', value, { shouldValidate: true });
  };


  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <SearchIcon className="mr-2 h-6 w-6" /> Consultar CEP
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o CEP (Ex: 01001-000)" 
                        {...field} 
                        onChange={handleCepChange}
                        maxLength={9}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  "Consultar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Display results or "not found" message only after a search attempt */}
      {searched && (
        result && !result.erro ? (
          <div className="mt-8">
            <CEPResultsCard result={result} />
          </div>
        ) : (
          <Card className="mt-8 shadow-lg">
              <CardHeader>
                  <CardTitle className="text-xl text-primary">Endereço não encontrado</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-center text-muted-foreground py-8">Nenhum endereço encontrado para o CEP informado ou o CEP é inválido.</p>
              </CardContent>
          </Card>
        )
      )}
    </>
  );
}
