
/**
 * @fileOverview Dados para cálculo de frete.
 * Contém distâncias de Rio Largo para outras cidades de Alagoas e
 * as regras para frete grátis.
 */

export interface CityDistance {
  [city: string]: number;
}

export const distancesFromRioLargo: CityDistance = {
  'Água Branca': 300,
  'Anadia': 90,
  'Arapiraca': 142,
  'Atalaia': 50,
  'Barra de Santo Antônio': 40,
  'Barra de São Miguel': 60,
  'Batalha': 200,
  'Belém': 150,
  'Belo Monte': 250,
  'Boca da Mata': 80,
  'Branquinha': 70,
  'Cacimbinhas': 180,
  'Cajueiro': 60,
  'Campestre': 110,
  'Campo Alegre': 100,
  'Campo Grande': 151,
  'Canapi': 320,
  'Capela': 55,
  'Carneiros': 210,
  'Chã Preta': 85,
  'Coité do Nóia': 130,
  'Colônia Leopoldina': 120,
  'Coqueiro Seco': 30,
  'Coruripe': 110,
  'Craíbas': 150,
  'Delmiro Gouveia': 270,
  'Dois Riachos': 220,
  'Estrela de Alagoas': 160,
  'Feira Grande': 140,
  'Feliz Deserto': 130,
  'Flexeiras': 65,
  'Girau do Ponciano': 160,
  'Ibateguara': 100,
  'Igaci': 145,
  'Igreja Nova': 170,
  'Inhapi': 310,
  'Jacaré dos Homens': 190,
  'Jacuípe': 140,
  'Japaratinga': 140,
  'Jaramataia': 180,
  'Jequiá da Praia': 90,
  'Joaquim Gomes': 80,
  'Jundiá': 100,
  'Junqueiro': 110,
  'Lagoa da Canoa': 135,
  'Limoeiro de Anadia': 120,
  'Maceió': 24,
  'Major Isidoro': 200,
  'Mar Vermelho': 95,
  'Maragogi': 133,
  'Maravilha': 230,
  'Marechal Deodoro': 30,
  'Maribondo': 75,
  'Mata Grande': 300,
  'Matriz de Camaragibe': 90,
  'Messias': 20,
  'Minador do Negrão': 170,
  'Monteirópolis': 210,
  'Murici': 40,
  'Novo Lino': 110,
  'Olho d\'Água das Flores': 190,
  'Olho d\'Água do Casado': 280,
  'Olho d\'Água Grande': 150,
  'Olivença': 180,
  'Ouro Branco': 220,
  'Palestina': 210,
  'Palmeira dos Índios': 145,
  'Pão de Açúcar': 230,
  'Pariconha': 290,
  'Paripueira': 35,
  'Passo de Camaragibe': 100,
  'Paulo Jacinto': 85,
  'Penedo': 162,
  'Piaçabuçu': 180,
  'Pilar': 40,
  'Pindoba': 95,
  'Piranhas': 290,
  'Poço das Trincheiras': 240,
  'Porto Calvo': 120,
  'Porto de Pedras': 130,
  'Porto Real do Colégio': 170,
  'Quebrangulo': 110,
  // 'Rio Largo Cidade': 10, //  Removido para evitar auto-seleção confusa, já que origem é Rio Largo
  'Roteiro': 70,
  'Santa Luzia do Norte': 25,
  'Santana do Ipanema': 190,
  'Santana do Mundaú': 100,
  'São Brás': 160,
  'São José da Laje': 90,
  'São José da Tapera': 200,
  'São Luís do Quitunde': 80,
  'São Miguel dos Campos': 70,
  'São Miguel dos Milagres': 110,
  'São Sebastião': 150,
  'Satuba': 15,
  'Senador Rui Palmeira': 220,
  'Tanque d\'Arca': 95,
  'Taquarana': 140,
  'Teotônio Vilela': 100,
  'Traipu': 180,
  'União dos Palmares': 90,
  'Viçosa': 80
};

export interface FreeShippingRule {
  maxDistance: number; // km
  minPurchaseValue: number; // R$
}

// Regras de frete grátis: se a distância for MENOR OU IGUAL à maxDistance
// E o valor da compra for MAIOR OU IGUAL ao minPurchaseValue.
// Ordenado por maxDistance para lógica correta de aplicação.
export const freeShippingRules: FreeShippingRule[] = [
  { maxDistance: 30, minPurchaseValue: 500 },
  { maxDistance: 50, minPurchaseValue: 1000 },
  { maxDistance: 75, minPurchaseValue: 1500 },
  { maxDistance: 100, minPurchaseValue: 2000 },
];

export const shippingRatePerKm = 2.00; // R$ 2,00 por km
export const minShippingCost = 50.00; // R$ 50,00 como frete mínimo
export const originCity = 'Rio Largo';

export const destinationCities = Object.keys(distancesFromRioLargo).sort();
