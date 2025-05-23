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
import { Loader2 } from "lucide-react";
import { reverseCEPSearch, type ReverseCEPSearchOutput } from "@/ai/flows/reverse-cep-search";
import ResultsTable from "./ResultsTable";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  streetName: z.string().min(1, { message: "Nome da rua é obrigatório." }),
  neighborhood: z.string().min(1, { message: "Bairro é obrigatório." }),
  city: z.string().min(1, { message: "Cidade é obrigatória." }),
});

type FormData = z.infer<typeof formSchema>;

export default function AddressForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<ReverseCEPSearchOutput | null>(null);
  const [searched, setSearched] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetName: "",
      neighborhood: "",
      city: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSearched(false);
    setResults(null);
    try {
      const response = await reverseCEPSearch({
        streetName: values.streetName,
        neighborhood: values.neighborhood,
        city: values.city,
      });
      setResults(response);
      setSearched(true);
      if (response.length === 0) {
        toast({
          title: "Nenhum CEP encontrado",
          description: "Não foram encontrados CEPs para o endereço fornecido.",
        });
      }
    } catch (error) {
      console.error("Erro na busca de CEP:", error);
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os CEPs. Tente novamente.",
      });
      setSearched(true); // Mark as searched even on error to potentially show a message
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Buscar Endereço</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="streetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua das Palmeiras" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
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
                    Buscando...
                  </>
                ) : (
                  "Buscar CEPs"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {results && results.length > 0 && (
        <div className="mt-8">
          <ResultsTable results={results} />
        </div>
      )}
      {searched && results && results.length === 0 && (
         <Card className="mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl text-primary">Resultados</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">Nenhum CEP encontrado para o endereço fornecido.</p>
            </CardContent>
         </Card>
      )}
    </>
  );
}
