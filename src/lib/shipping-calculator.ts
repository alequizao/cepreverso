
/**
 * @fileOverview Lógica para cálculo de frete.
 */
import { 
    distancesFromRioLargo, 
    freeShippingRules, 
    shippingRatePerKm, 
    minShippingCost, 
    originCity,
    alagoasCityCoordinates, 
    rioLargoCoordinates,     
    type CityCoordinates    
} from './shipping-data';

export interface ShippingCalculationInput {
  destinationCity: string;
  purchaseValue: number;
}

export interface ShippingCalculationOutput {
  distanceKm?: string;
  shippingCost?: string;
  error?: string;
  originCoords?: CityCoordinates;
  destinationCoords?: CityCoordinates;
  destinationCityName?: string;
  purchaseValue?: number; // Adicionado para exibir o total
}

export function calculateShipping(input: ShippingCalculationInput): ShippingCalculationOutput {
  const { destinationCity, purchaseValue } = input;

  if (!destinationCity) {
    return { error: 'Selecione a cidade de destino!' };
  }

  // Não permitir cálculo se origem e destino forem os mesmos,
  // mas permitir que o mapa mostre a cidade de origem se for selecionada como destino (para preview)
  // O erro de "cidades iguais" é mais para o cálculo final do frete.
  // if (destinationCity === originCity) {
  //   return { error: 'A cidade de origem e destino não podem ser a mesma para cálculo de frete.' };
  // }

  const distance = distancesFromRioLargo[destinationCity];
  const destinationCoords = alagoasCityCoordinates[destinationCity];

  // Se a cidade de destino for a mesma que a origem, retorne apenas as coordenadas para o mapa.
  if (destinationCity === originCity) {
    return {
      originCoords: rioLargoCoordinates,
      destinationCoords: rioLargoCoordinates, // Mesmo ponto
      destinationCityName: destinationCity,
      distanceKm: '0 km',
      shippingCost: 'N/A (Origem = Destino)',
      purchaseValue: purchaseValue,
    };
  }

  if (typeof distance === 'undefined') {
    // Pode acontecer se a cidade selecionada não estiver em `distancesFromRioLargo`
    // mas estiver em `alagoasCityCoordinates` (usado para o Select)
    return { 
        error: 'Rota não encontrada para o destino selecionado.',
        originCoords: rioLargoCoordinates,
        destinationCoords: destinationCoords, // Ainda mostra no mapa se tiver coords
        destinationCityName: destinationCity,
        purchaseValue: purchaseValue,
    };
  }
  if (!destinationCoords) {
    // Isso não deve acontecer se destinationCities for derivado de alagoasCityCoordinates
    // ou se a cidade estiver em distancesFromRioLargo (que implica que deveria ter coords)
    return { 
        error: 'Coordenadas não encontradas para a cidade de destino.',
        originCoords: rioLargoCoordinates,
        destinationCityName: destinationCity,
        purchaseValue: purchaseValue,
    };
  }

  let isFreeShipping = false;
  for (const rule of freeShippingRules) {
    if (distance <= rule.maxDistance && purchaseValue >= rule.minPurchaseValue) {
      isFreeShipping = true;
      break;
    }
  }

  let finalShippingCost: string;
  if (isFreeShipping) {
    finalShippingCost = 'FRETE GRÁTIS';
  } else {
    const calculatedCost = distance * shippingRatePerKm;
    const costToApply = Math.max(calculatedCost, minShippingCost);
    finalShippingCost = `R$ ${costToApply.toFixed(2).replace('.', ',')}`;
  }

  return {
    distanceKm: `${distance} km`,
    shippingCost: finalShippingCost,
    originCoords: rioLargoCoordinates,
    destinationCoords: destinationCoords,
    destinationCityName: destinationCity,
    purchaseValue: purchaseValue,
  };
}
