"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CEPSearchOutput } from "@/ai/flows/cep-search-flow";

interface CEPResultsCardProps {
  result: CEPSearchOutput;
}

export default function CEPResultsCard({ result }: CEPResultsCardProps) {
  const { toast } = useToast();

  if (!result || result.erro) { 
    // This case should ideally be handled by the parent component (CEPForm)
    // to show a "not found" message instead of rendering this card.
    return null; 
  }

  const addressItems = [
    { label: 'CEP', value: result.cep },
    { label: 'Logradouro', value: result.logradouro },
    { label: 'Complemento', value: result.complemento },
    { label: 'Bairro', value: result.bairro },
    { label: 'Cidade', value: result.localidade },
    { label: 'UF', value: result.uf },
    { label: 'Cód. IBGE', value: result.ibge },
    { label: 'DDD', value: result.ddd },
    // GIA and SIAFI are often empty or not relevant for all users, can be omitted if desired
    // { label: 'Cód. GIA', value: result.gia },
    // { label: 'Cód. SIAFI', value: result.siafi },
  ];

  const fullAddress = addressItems
    .filter(item => item.value && String(item.value).trim() !== '')
    .map(item => `${item.label}: ${item.value}`)
    .join(', ');

  const handleCopy = (textToCopy: string, fieldName: string) => {
    if (!textToCopy || textToCopy.trim() === "") {
        toast({
          variant: "destructive",
          title: "Nada para copiar",
          description: `O campo ${fieldName.toLowerCase()} está vazio.`,
        });
        return;
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: `${fieldName} Copiado!`,
          description: `O ${fieldName.toLowerCase()} "${textToCopy}" foi copiado.`,
        });
      })
      .catch(err => {
        console.error(`Erro ao copiar ${fieldName}:`, err);
        toast({
          variant: "destructive",
          title: "Erro ao copiar",
          description: `Não foi possível copiar o ${fieldName.toLowerCase()}.`,
        });
      });
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
            <MapPin className="mr-2 h-5 w-5"/> Endereço Encontrado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {addressItems.map((item) => {
          const valueString = String(item.value).trim();
          if (!valueString) return null; // Don't render empty fields

          return (
            <div key={item.label} className="flex justify-between items-center text-sm py-1 border-b border-border last:border-b-0">
              <div>
                <span className="font-semibold text-muted-foreground">{item.label}: </span>
                <span className="text-foreground">{valueString}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(valueString, item.label)}
                aria-label={`Copiar ${item.label}`}
                className="text-accent hover:text-accent/80 h-8 w-8" // Slightly larger hit area
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
         <div className="pt-4">
            <Button 
                onClick={() => handleCopy(fullAddress, 'Endereço Completo')} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                <Copy className="mr-2 h-4 w-4" /> Copiar Endereço Completo
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
