
/**
 * @fileOverview Dados para cálculo de frete e coordenadas das cidades de Alagoas.
 * Contém distâncias de Rio Largo para outras cidades de Alagoas,
 * as regras para frete grátis e coordenadas geográficas aproximadas.
 */

export interface CityDistance {
  [city: string]: number;
}

export interface CityCoordinates {
  lat: number;
  lng: number;
}

export interface CityGeoData {
  [city: string]: CityCoordinates;
}

// Coordenadas aproximadas para Rio Largo
export const rioLargoCoordinates: CityCoordinates = { lat: -9.4835, lng: -35.8439 };
export const originCity = 'Rio Largo';


// Distâncias de Rio Largo para outras cidades de Alagoas (em km)
// Estas são as distâncias que você forneceu.
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
  // 'Rio Largo Cidade': 10, // Removido para evitar auto-seleção confusa, já que origem é Rio Largo
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

// Coordenadas geográficas (latitude, longitude) aproximadas para as cidades de Alagoas
// Fonte: Estimadas a partir de dados públicos (ex: IBGE, OpenStreetMap, ou GeoJSONs de municípios)
// Para uma aplicação real e precisa, seria ideal usar uma API de geocodificação ou um dataset oficial.
export const alagoasCityCoordinates: CityGeoData = {
  'Água Branca': { lat: -9.2625, lng: -37.9377 },
  'Anadia': { lat: -9.6842, lng: -36.3041 },
  'Arapiraca': { lat: -9.7525, lng: -36.6614 },
  'Atalaia': { lat: -9.5011, lng: -36.025 },
  'Barra de Santo Antônio': { lat: -9.405, lng: -35.5052 },
  'Barra de São Miguel': { lat: -9.8391, lng: -35.8713 },
  'Batalha': { lat: -9.6761, lng: -37.1252 },
  'Belém': { lat: -9.5505, lng: -36.4869 },
  'Belo Monte': { lat: -9.7616, lng: -37.2711 },
  'Boca da Mata': { lat: -9.638, lng: -36.2222 },
  'Branquinha': { lat: -9.2413, lng: -36.0133 },
  'Cacimbinhas': { lat: -9.3994, lng: -37.0097 },
  'Cajueiro': { lat: -9.3916, lng: -36.2152 },
  'Campestre': { lat: -8.8388, lng: -35.5797 },
  'Campo Alegre': { lat: -9.7833, lng: -36.3527 },
  'Campo Grande': { lat: -9.9538, lng: -36.7833 },
  'Canapi': { lat: -9.1191, lng: -37.5958 },
  'Capela': { lat: -9.4069, lng: -36.0747 },
  'Carneiros': { lat: -9.2072, lng: -37.3822 },
  'Chã Preta': { lat: -9.2555, lng: -36.3008 },
  'Coité do Nóia': { lat: -9.6597, lng: -36.5322 },
  'Colônia Leopoldina': { lat: -8.9038, lng: -35.7252 },
  'Coqueiro Seco': { lat: -9.6302, lng: -35.7983 },
  'Coruripe': { lat: -10.1258, lng: -36.1758 },
  'Craíbas': { lat: -9.595, lng: -36.7563 },
  'Delmiro Gouveia': { lat: -9.3875, lng: -37.9972 },
  'Dois Riachos': { lat: -9.3833, lng: -37.0972 },
  'Estrela de Alagoas': { lat: -9.4138, lng: -36.7616 },
  'Feira Grande': { lat: -9.8883, lng: -36.6752 },
  'Feliz Deserto': { lat: -10.2922, lng: -36.3055 },
  'Flexeiras': { lat: -9.2852, lng: -35.7833 },
  'Girau do Ponciano': { lat: -9.8869, lng: -36.8358 },
  'Ibateguara': { lat: -8.9838, lng: -35.9216 },
  'Igaci': { lat: -9.5508, lng: -36.6269 },
  'Igreja Nova': { lat: -10.123, lng: -36.6611 },
  'Inhapi': { lat: -9.2208, lng: -37.7541 },
  'Jacaré dos Homens': { lat: -9.6338, lng: -37.0697 },
  'Jacuípe': { lat: -8.8525, lng: -35.6058 },
  'Japaratinga': { lat: -9.0941, lng: -35.2575 },
  'Jaramataia': { lat: -9.6697, lng: -37.0005 },
  'Jequiá da Praia': { lat: -9.9647, lng: -36.0202 },
  'Joaquim Gomes': { lat: -9.1902, lng: -35.7847 },
  'Jundiá': { lat: -8.968, lng: -35.5763 },
  'Junqueiro': { lat: -9.9169, lng: -36.4702 },
  'Lagoa da Canoa': { lat: -9.8233, lng: -36.7452 },
  'Limoeiro de Anadia': { lat: -9.7402, lng: -36.5086 },
  'Maceió': { lat: -9.6658, lng: -35.7352 },
  'Major Isidoro': { lat: -9.5272, lng: -36.9905 },
  'Mar Vermelho': { lat: -9.4508, lng: -36.3677 },
  'Maragogi': { lat: -9.0122, lng: -35.2225 },
  'Maravilha': { lat: -9.2422, lng: -37.355 },
  'Marechal Deodoro': { lat: -9.7102, lng: -35.8952 },
  'Maribondo': { lat: -9.5769, lng: -36.2958 },
  'Mata Grande': { lat: -9.1138, lng: -37.7305 },
  'Matriz de Camaragibe': { lat: -9.1763, lng: -35.5261 },
  'Messias': { lat: -9.3836, lng: -35.8436 },
  'Minador do Negrão': { lat: -9.3113, lng: -36.8655 },
  'Monteirópolis': { lat: -9.6336, lng: -37.1802 },
  'Murici': { lat: -9.3061, lng: -35.9438 },
  'Novo Lino': { lat: -9.005, lng: -35.6483 },
  'Olho d\'Água das Flores': { lat: -9.5272, lng: -37.2952 },
  'Olho d\'Água do Casado': { lat: -9.4869, lng: -37.8308 },
  'Olho d\'Água Grande': { lat: -9.9841, lng: -36.9197 },
  'Olivença': { lat: -9.5066, lng: -37.1888 },
  'Ouro Branco': { lat: -9.1666, lng: -37.3536 },
  'Palestina': { lat: -9.6625, lng: -37.3291 },
  'Palmeira dos Índios': { lat: -9.4072, lng: -36.6291 },
  'Pão de Açúcar': { lat: -9.7516, lng: -37.4047 },
  'Pariconha': { lat: -9.258, lng: -38.0105 },
  'Paripueira': { lat: -9.4663, lng: -35.5533 },
  'Passo de Camaragibe': { lat: -9.2327, lng: -35.4905 },
  'Paulo Jacinto': { lat: -9.3413, lng: -36.3647 },
  'Penedo': { lat: -10.29, lng: -36.5783 },
  'Piaçabuçu': { lat: -10.4063, lng: -36.4336 },
  'Pilar': { lat: -9.5972, lng: -35.9566 },
  'Pindoba': { lat: -9.4736, lng: -36.2911 },
  'Piranhas': { lat: -9.6238, lng: -37.7575 },
  'Poço das Trincheiras': { lat: -9.3077, lng: -37.2833 },
  'Porto Calvo': { lat: -9.1505, lng: -35.3988 },
  'Porto de Pedras': { lat: -9.1602, lng: -35.2891 },
  'Porto Real do Colégio': { lat: -10.1861, lng: -36.8386 },
  'Quebrangulo': { lat: -9.3188, lng: -36.4736 },
  'Roteiro': { lat: -9.8319, lng: -35.9697 },
  'Santa Luzia do Norte': { lat: -9.6008, lng: -35.8219 },
  'Santana do Ipanema': { lat: -9.3738, lng: -37.2436 },
  'Santana do Mundaú': { lat: -9.1686, lng: -36.2202 },
  'São Brás': { lat: -10.1238, lng: -36.9516 },
  'São José da Laje': { lat: -9.0133, lng: -36.0569 },
  'São José da Tapera': { lat: -9.5577, lng: -37.3808 },
  'São Luís do Quitunde': { lat: -9.3147, lng: -35.5533 },
  'São Miguel dos Campos': { lat: -9.7844, lng: -36.0936 },
  'São Miguel dos Milagres': { lat: -9.2663, lng: -35.3736 },
  'São Sebastião': { lat: -9.9347, lng: -36.5516 },
  'Satuba': { lat: -9.5619, lng: -35.8188 },
  'Senador Rui Palmeira': { lat: -9.3775, lng: -37.5216 },
  'Tanque d\'Arca': { lat: -9.5261, lng: -36.4225 },
  'Taquarana': { lat: -9.6036, lng: -36.4994 },
  'Teotônio Vilela': { lat: -9.9397, lng: -36.3525 },
  'Traipu': { lat: -9.9688, lng: -37.0036 },
  'União dos Palmares': { lat: -9.163, lng: -36.0311 },
  'Viçosa': { lat: -9.3725, lng: -36.2408 }
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


export const destinationCities = Object.keys(distancesFromRioLargo).sort();
