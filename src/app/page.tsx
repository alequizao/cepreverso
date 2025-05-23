
import AddressForm from '@/components/features/cep/AddressForm';
import CEPForm from '@/components/features/cep/CEPForm';
import ShippingCalculatorForm from '@/components/features/shipping/ShippingCalculatorForm'; // Importa o novo formulário de frete
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Truck } from 'lucide-react'; // Adiciona o ícone Truck

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Consultas e Serviços</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Busque CEPs, endereços ou calcule o frete para cidades de Alagoas.
          </p>
        </header>

        <Tabs defaultValue="shipping" className="w-full"> {/* Alterado defaultValue para "shipping" */}
          <TabsList className="grid w-full grid-cols-3 mb-6"> {/* Ajusta para 3 colunas */}
            <TabsTrigger value="shipping"> {/* Nova aba de Frete */}
              <Truck className="mr-2 h-4 w-4" /> Calcular Frete
            </TabsTrigger>
            <TabsTrigger value="addressToCep">
              <MapPin className="mr-2 h-4 w-4" /> Endereço para CEP
            </TabsTrigger>
            <TabsTrigger value="cepToAddress">
              <Search className="mr-2 h-4 w-4" /> CEP para Endereço
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shipping"> {/* Conteúdo da nova aba de Frete */}
            <ShippingCalculatorForm />
          </TabsContent>
          <TabsContent value="addressToCep">
            <AddressForm />
          </TabsContent>
          <TabsContent value="cepToAddress">
            <CEPForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
