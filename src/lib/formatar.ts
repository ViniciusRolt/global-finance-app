const simbolos: Record<string, string> = { GBP: '£', BRL: 'R$', USD: '$', EUR: '€' };

export function formatarMoeda(valor: number | string | null | undefined, moeda = 'GBP') {
  const numero = Number(valor ?? 0);
  const texto = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${simbolos[moeda] ?? moeda + ' '}${texto}`;
}

export function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
