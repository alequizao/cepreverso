
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dynamic from 'next/dynamic'; 

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { originCity, destinationCities, vltOriginCoordinates, type CityCoordinates } from "@/lib/shipping-data";
import { calculateShipping, type ShippingCalculationInput, type ShippingCalculationOutput } from "@/lib/shipping-calculator";

const MapDisplay = dynamic(() => import('./MapDisplay'), {
  ssr: false,
  loading: () => (
    <Card className="shadow-lg w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <Truck className="mr-2 h-5 w-5" /> Visualização no Mapa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </CardContent>
    </Card>
  )
});


const formSchema = z.object({
  destinationCity: z.string().min(1, { message: "Selecione a cidade de destino." }),
  purchaseValue: z.coerce
    .number({ invalid_type_error: "Valor da compra deve ser um número." })
    .positive({ message: "Valor da compra deve ser positivo." })
    .min(0.01, { message: "Valor da compra deve ser maior que zero." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ShippingCalculatorForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<ShippingCalculationOutput | null>(null);
  const { toast } = useToast();

  // Coordenadas da VLT Material de Construção são agora a origem padrão.
  const [originMapCoords, setOriginMapCoords] = React.useState<CityCoordinates | undefined>(vltOriginCoordinates);
  const [destinationMapCoords, setDestinationMapCoords] = React.useState<CityCoordinates | undefined>(undefined);
  const [selectedDestCityName, setSelectedDestCityName] = React.useState<string | undefined>(undefined);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationCity: "",
      purchaseValue: undefined,
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResults(null); 

    const calculationInput: ShippingCalculationInput = {
      destinationCity: values.destinationCity,
      purchaseValue: values.purchaseValue,
    };

    await new Promise(resolve => setTimeout(resolve, 300)); 

    const output = calculateShipping(calculationInput);

    if (output.error) {
      toast({
        variant: "destructive",
        title: "Erro no Cálculo",
        description: output.error,
      });
      setResults(null);
    } else {
      setResults(output);
      // Assegurar que coordenadas do mapa sejam atualizadas com base no resultado
      if (output.originCoords) setOriginMapCoords(output.originCoords); // Deve ser sempre VLT coords
      if (output.destinationCoords) setDestinationMapCoords(output.destinationCoords);
      if (output.destinationCityName) setSelectedDestCityName(output.destinationCityName);
    }

    setIsLoading(false);
  }

  const handleDestinationChange = (selectedCityValue: string) => {
    form.setValue('destinationCity', selectedCityValue, { shouldValidate: true }); 
    
    const previewData = calculateShipping({ destinationCity: selectedCityValue, purchaseValue: 1 }); 

    if (previewData.destinationCoords && previewData.destinationCityName) {
        setDestinationMapCoords(previewData.destinationCoords);
        setSelectedDestCityName(previewData.destinationCityName);
    } else {
        setDestinationMapCoords(undefined);
        setSelectedDestCityName(undefined);
    }
     // Atualiza as coordenadas de origem para VLT (pode ser redundante se já setado, mas garante)
    setOriginMapCoords(vltOriginCoordinates);
    setResults(null); 
  };


  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <Truck className="mr-2 h-6 w-6" /> Calculadora de Frete - Alagoas
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormItem>
                <FormLabel>Origem</FormLabel>
                <FormControl>
                  {/* O valor do campo de origem agora é dinâmico e usa `originCity` de `shipping-data.ts` */}
                  <Input value={originCity} readOnly className="bg-muted/50 cursor-not-allowed" />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="destinationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        handleDestinationChange(value);
                      }}
                      defaultValue={field.value} 
                      value={field.value} 
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cidade de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinationCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Compra (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 1000.00"
                        {...field}
                        value={(field.value === undefined || field.value === null || Number.isNaN(field.value as number)) ? '' : String(field.value)}
                        onChange={e => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : parseFloat(val));
                        }}
                        step="0.01"
                        min="0.01"
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
                    Calculando...
                  </>
                ) : (
                  "Calcular Frete e Ver Rota"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {results && !results.error && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Resultado do Frete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-center">
            {results.distanceKm && (
              <p className="text-lg">
                <strong>Distância (pré-definida):</strong> {results.distanceKm}
              </p>
            )}
            {results.shippingCost && (
              <p className="text-lg font-semibold">
                <strong>Valor do Frete:</strong> <span className={results.shippingCost === 'FRETE GRÁTIS' ? 'text-green-600' : 'text-destructive'}>{results.shippingCost}</span>
              </p>
            )}
            {results.shippingCost !== 'FRETE GRÁTIS' && results.purchaseValue && results.shippingCost &&
              (() => {
                  const cost = parseFloat(String(results.shippingCost).replace('R$ ', '').replace(',', '.'));
                  const total = results.purchaseValue + cost;
                  return <p className="text-md"><strong>Total (Compra + Frete):</strong> R$ {total.toFixed(2).replace('.', ',')}</p>
              })()
            }
          </CardContent>
        </Card>
      )}

      <MapDisplay
          originCoords={originMapCoords}
          destinationCoords={destinationMapCoords}
          originCityName={originCity} // Passa o nome da cidade de origem atualizado
          destinationCityName={selectedDestCityName}
      />
    </>
  );
}

    