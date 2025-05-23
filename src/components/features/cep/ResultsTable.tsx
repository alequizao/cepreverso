"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReverseCEPSearchOutput } from "@/ai/flows/reverse-cep-search";

interface ResultsTableProps {
  results: ReverseCEPSearchOutput;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const { toast } = useToast();

  const handleCopy = (cep: string) => {
    navigator.clipboard.writeText(cep)
      .then(() => {
        toast({
          title: "CEP Copiado!",
          description: `O CEP ${cep} foi copiado para a área de transferência.`,
        });
      })
      .catch(err => {
        console.error("Erro ao copiar CEP:", err);
        toast({
          variant: "destructive",
          title: "Erro ao copiar",
          description: "Não foi possível copiar o CEP.",
        });
      });
  };

  if (!results || results.length === 0) {
    return null; // AddressForm handles the "no results" message after search
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Resultados Encontrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">CEP</TableHead>
                <TableHead>Logradouro</TableHead>
                <TableHead className="text-right w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.cep}</TableCell>
                  <TableCell>{item.streetName}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(item.cep)}
                      aria-label={`Copiar CEP ${item.cep}`}
                      className="text-accent hover:text-accent/80"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
