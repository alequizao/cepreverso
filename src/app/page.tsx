
import AddressForm from '@/components/features/cep/AddressForm';
import CEPForm from '@/components/features/cep/CEPForm';
import ShippingCalculatorForm from '@/components/features/shipping/ShippingCalculatorForm';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto space-y-12 md:space-y-20">
        {/* Hero Section */}
        <header className="text-center pt-8 pb-4 md:pt-12 md:pb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
            Consultas Inteligentes e Frete Descomplicado
          </h1>
          <p className="mt-4 md:mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Sua plataforma completa para buscar CEPs, endereços e calcular fretes em Alagoas com precisão e agilidade.
          </p>
        </header>

        {/* Shipping Calculator Section - Prominent */}
        <section id="shipping-calculator" className="w-full scroll-mt-20" aria-labelledby="shipping-calculator-heading">
          <div className="text-center mb-8 md:mb-12">
            <h2 id="shipping-calculator-heading" className="text-3xl sm:text-4xl font-semibold text-foreground">
              Calcule seu Frete e Visualize a Rota
            </h2>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Informe a cidade de destino e o valor da compra para obter o custo do frete e ver o trajeto no mapa.
            </p>
          </div>
          <ShippingCalculatorForm /> {/* This component renders its own card(s) */}
        </section>

        <Separator className="my-8 md:my-12 bg-border" />

        {/* Address and CEP Tools Section */}
        <section id="address-cep-tools" className="w-full scroll-mt-20" aria-labelledby="address-cep-tools-heading">
          <div className="text-center mb-8 md:mb-12">
            <h2 id="address-cep-tools-heading" className="text-3xl sm:text-4xl font-semibold text-foreground">
              Ferramentas de Endereçamento
            </h2>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre CEPs a partir de endereços ou consulte endereços completos a partir de CEPs.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            <div id="address-to-cep">
              <AddressForm /> {/* This component renders its own Card */}
            </div>
            <div id="cep-to-address">
              <CEPForm /> {/* This component renders its own Card */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 pb-8 mt-12 border-t border-border">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Consultas e Fretes. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
