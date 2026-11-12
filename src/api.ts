import { BASE_CURRENCY } from './constants';
import type { Rates } from './types';

const API_URL = 'https://economia.awesomeapi.com.br/json/all';

type ApiEntry = { codein: string, name: string, ask: string };

export async function getRates(): Promise<Rates> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Falha ao buscar cotações (${response.status})`);
  const data = await response.json() as Record<string, ApiEntry>;
  const rates: Rates = { [BASE_CURRENCY]: { name: 'Real Brasileiro', ask: 1 } };
  Object.entries(data).forEach(([code, entry]) => {
    const ask = Number(entry.ask);
    // USDT usa outra moeda base; só aceitamos cotações contra BRL
    const invalid = code === 'USDT' || entry.codein !== BASE_CURRENCY || ask <= 0;
    if (invalid || Number.isNaN(ask)) return;
    rates[code] = { name: entry.name.split('/')[0], ask };
  });
  return rates;
}
