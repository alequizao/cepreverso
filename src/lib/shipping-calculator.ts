
/**
 * @fileOverview Lógica para cálculo de frete.
 */
import { distancesFromRioLargo, freeShippingRules, shippingRatePerKm, minShippingCost, originCity } from './shipping-data';

export interface ShippingCalculationInput {
  destinationCity: string;
  purchaseValue: number;
}

export interface ShippingCalculationOutput {
  distanceKm?: string;
  shippingCost?: string;
  error?: string;
}

export function calculateShipping(input: ShippingCalculationInput): ShippingCalculationOutput {
  const { destinationCity, purchaseValue } = input;

  if (!destinationCity) {
    return { error: 'Selecione a cidade de destino!' };
  }

  if (destinationCity === originCity) {
    // Embora a UI previna isso, é uma boa checagem.
    return { error: 'A cidade de origem e destino não podem ser a mesma para cálculo de frete.' };
  }

  const distance = distancesFromRioLargo[destinationCity];

  if (typeof distance === 'undefined') {
    return { error: 'Rota não encontrada para o destino selecionado.' };
  }

  let isFreeShipping = false;
  // As regras devem ser aplicadas em ordem, geralmente da mais restritiva/menor distância para maior
  // O array freeShippingRules já está ordenado por maxDistance.
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
  };
}
