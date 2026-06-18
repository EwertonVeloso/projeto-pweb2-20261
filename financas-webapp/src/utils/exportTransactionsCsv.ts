import type { Transaction } from '../types';



/** Opções de filtro por período para a exportação */
export interface ExportCsvOptions {
  startDate?: string;
  endDate?: string;
}


function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Formata a data de "YYYY-MM-DD" para "DD/MM/YYYY" (padrão brasileiro).
 */
function formatDateBR(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}

/**
 * Formata o valor monetário para o padrão brasileiro
 */
function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}

/**
 * Traduz o tipo da transação para exibição no CSV.
 */
function translateType(type: 'INCOME' | 'EXPENSE'): string {
  return type === 'INCOME' ? 'Receita' : 'Despesa';
}

/**
 * Filtra transações por período.
 */
function filterByPeriod(
  transactions: Transaction[],
  options?: ExportCsvOptions,
): Transaction[] {
  if (!options?.startDate && !options?.endDate) {
    return transactions;
  }

  return transactions.filter((t) => {
    if (!t.date) return false;
    if (options?.startDate && t.date < options.startDate) return false;
    if (options?.endDate && t.date > options.endDate) return false;
    return true;
  });
}

/**
 * Gera o conteúdo CSV a partir de um array de transações.
 */
export function generateCsvContent(
  transactions: Transaction[],
  options?: ExportCsvOptions,
): string {
  const filtered = filterByPeriod(transactions, options);

  const header = ['Data', 'Categoria', 'Valor', 'Tipo', 'Descrição'];

  const rows = filtered.map((t) => [
    escapeCsvField(formatDateBR(t.date)),
    escapeCsvField(t.categoryName || ''),
    escapeCsvField(formatCurrency(t.amount)),
    escapeCsvField(translateType(t.type)),
    escapeCsvField(t.description || ''),
  ]);

  const csvLines = [header.join(','), ...rows.map((row) => row.join(','))];
  return csvLines.join('\n');
}

/**
 * Gera um nome de arquivo descritivo para o CSV exportado.
 */
function buildFileName(options?: ExportCsvOptions): string {
  const parts = ['transacoes'];

  if (options?.startDate) {
    parts.push(`de_${options.startDate}`);
  }
  if (options?.endDate) {
    parts.push(`ate_${options.endDate}`);
  }

  if (!options?.startDate && !options?.endDate) {
    const today = new Date().toISOString().split('T')[0];
    parts.push(today);
  }

  return `${parts.join('_')}.csv`;
}

/**
 * Função principal de exportação.
 * Gera o CSV a partir das transações fornecidas (dados do Redux),
 * aplica filtro de período opcional, e inicia o download imediato
 * do arquivo no navegador.
 *
 * @param transactions Array de transações do Redux store
 * @param options Filtros opcionais de período (startDate / endDate)
 */
export function exportTransactionsCsv(
  transactions: Transaction[],
  options?: ExportCsvOptions,
): void {
  const csvContent = generateCsvContent(transactions, options);

  // Adiciona BOM UTF-8 para compatibilidade com Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = buildFileName(options);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Limpeza
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
