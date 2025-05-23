import AddressForm from '@/components/features/cep/AddressForm';
import CEPForm from '@/components/features/cep/CEPForm'; // Import the new form
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Consultor de CEP</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Busque por CEP informando o endereço ou consulte um endereço informando o CEP.
          </p>
        </header>

        <Tabs defaultValue="addressToCep" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="addressToCep">
              <MapPin className="mr-2 h-4 w-4" /> Endereço para CEP
            </TabsTrigger>
            <TabsTrigger value="cepToAddress">
              <Search className="mr-2 h-4 w-4" /> CEP para Endereço
            </TabsTrigger>
          </TabsList>
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
