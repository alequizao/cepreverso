import AddressForm from '@/components/features/cep/AddressForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">CEP Reverso</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Digite o nome da rua, bairro e cidade para encontrar os CEPs correspondentes.
          </p>
        </header>
        <AddressForm />
      </div>
    </main>
  );
}
