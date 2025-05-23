
/**
 * @fileOverview Lógica para cálculo de frete.
 */
import { 
    distancesFromOrigin, 
    freeShippingRules, 
    shippingRatePerKm, 
    minShippingCost, 
    originCity,
    alagoasCityCoordinates, 
    vltOriginCoordinates,     
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
  originCityName?: string; // Adicionado para passar o nome da origem ao mapa
  destinationCityName?: string;
  purchaseValue?: number;
}

export function calculateShipping(input: ShippingCalculationInput): ShippingCalculationOutput {
  const { destinationCity, purchaseValue } = input;

  if (!destinationCity) {
    return { error: 'Selecione a cidade de destino!' };
  }

  const distance = distancesFromOrigin[destinationCity];
  const destinationCoords = alagoasCityCoordinates[destinationCity];

  // Se a cidade de destino for a mesma que a origem nominal (VLT)
  // No entanto, o nome da cidade de destino pode não ser exatamente igual a `originCity`
  // Melhor seria uma verificação mais robusta se necessário, ou confiar que o usuário não selecionará a própria VLT como destino.
  // Para o mapa, sempre forneceremos as coordenadas da VLT como origem.
  if (destinationCity === originCity) { // Simplificando: se o nome selecionado for igual ao nome da origem
    return {
      originCoords: vltOriginCoordinates,
      destinationCoords: vltOriginCoordinates, 
      originCityName: originCity,
      destinationCityName: destinationCity,
      distanceKm: '0 km',
      shippingCost: 'N/A (Origem = Destino)',
      purchaseValue: purchaseValue,
    };
  }

  if (typeof distance === 'undefined') {
    return { 
        error: 'Rota não encontrada para o destino selecionado. As distâncias de frete para este destino não foram pré-definidas.',
        originCoords: vltOriginCoordinates,
        destinationCoords: destinationCoords, 
        originCityName: originCity,
        destinationCityName: destinationCity,
        purchaseValue: purchaseValue,
    };
  }
  if (!destinationCoords) {
    return { 
        error: 'Coordenadas não encontradas para a cidade de destino.',
        originCoords: vltOriginCoordinates,
        originCityName: originCity,
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
    originCoords: vltOriginCoordinates,
    destinationCoords: destinationCoords,
    originCityName: originCity,
    destinationCityName: destinationCity,
    purchaseValue: purchaseValue,
  };
}


    