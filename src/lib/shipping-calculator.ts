
/**
 * @fileOverview Lógica para cálculo de frete.
 */
import { 
    distancesFromRioLargo, 
    freeShippingRules, 
    shippingRatePerKm, 
    minShippingCost, 
    originCity,
    alagoasCityCoordinates, // Importa as coordenadas
    rioLargoCoordinates,     // Importa coordenadas de Rio Largo
    type CityCoordinates    // Importa o tipo
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
}

export function calculateShipping(input: ShippingCalculationInput): ShippingCalculationOutput {
  const { destinationCity, purchaseValue } = input;

  if (!destinationCity) {
    return { error: 'Selecione a cidade de destino!' };
  }

  if (destinationCity === originCity) {
    return { error: 'A cidade de origem e destino não podem ser a mesma para cálculo de frete.' };
  }

  const distance = distancesFromRioLargo[destinationCity];
  const destinationCoords = alagoasCityCoordinates[destinationCity];

  if (typeof distance === 'undefined') {
    return { error: 'Rota não encontrada para o destino selecionado.' };
  }
  if (!destinationCoords) {
    // Isso não deve acontecer se destinationCities for derivado de alagoasCityCoordinates
    return { error: 'Coordenadas não encontradas para a cidade de destino.'};
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
  };
}
