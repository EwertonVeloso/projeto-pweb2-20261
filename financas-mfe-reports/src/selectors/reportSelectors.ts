import type { ReportFilters } from '../hooks/useReportFilters';

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  categoryName: string;
  date: string;
  description: string;
  tag: string | null;
}

export interface TransactionState {
  items: Transaction[];
  status: string;
  error: string | null;
}

export interface RootState {
  transactions: TransactionState;
}

// 1. Filtrar as transações em memória
export const selectFilteredTransactions = (state: RootState, filters: ReportFilters): Transaction[] => {
  const transactions = state.transactions?.items || [];

  return transactions.filter((t) => {
    // Filtrar por Ano
    const matchYear = filters.year === 'all' || t.date.startsWith(filters.year);

    // Filtrar por Mês (extraído da data YYYY-MM-DD, posições 5 e 6)
    const matchMonth = filters.month === 'all' || t.date.substring(5, 7) === filters.month;

    // Filtrar por Categoria
    const matchCategory = filters.categoryId === '' || t.categoryId === filters.categoryId;

    // Filtrar por Tipo
    const matchType = filters.type === '' || t.type === filters.type;

    return matchYear && matchMonth && matchCategory && matchType;
  });
};

// 2. Calcular Totais
export const selectReportTotals = (filteredTransactions: Transaction[]) => {
  let income = 0;
  let expense = 0;

  filteredTransactions.forEach((t) => {
    const val = Number(t.amount) || 0;
    if (t.type === 'INCOME') {
      income += val;
    } else if (t.type === 'EXPENSE') {
      expense += val;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

// 3. Agrupar Despesas por Categoria para o Donut Chart
export const selectExpensesByCategory = (filteredTransactions: Transaction[]) => {
  const expenses = filteredTransactions.filter((t) => t.type === 'EXPENSE');
  const grouped: Record<string, number> = {};

  expenses.forEach((t) => {
    const category = t.categoryName || 'Sem Categoria';
    const amount = Number(t.amount) || 0;
    grouped[category] = (grouped[category] || 0) + amount;
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);
};

// 4. Formato para Gráfico Comparativo de Barras (Receitas vs Despesas)
export const selectIncomeVsExpensesData = (filteredTransactions: Transaction[]) => {
  let income = 0;
  let expense = 0;

  filteredTransactions.forEach((t) => {
    const val = Number(t.amount) || 0;
    if (t.type === 'INCOME') {
      income += val;
    } else if (t.type === 'EXPENSE') {
      expense += val;
    }
  });

  return [
    {
      name: 'Resumo',
      Receitas: parseFloat(income.toFixed(2)),
      Despesas: parseFloat(expense.toFixed(2)),
    },
  ];
};

// 5. Evolução do Saldo no Período (Ordenado Cronologicamente)
export const selectBalanceEvolutionData = (filteredTransactions: Transaction[], filters: ReportFilters) => {
  // Ordena por data crescente
  const sorted = [...filteredTransactions].sort((a, b) => a.date.localeCompare(b.date));

  // Se for um mês específico selecionado (e.g. ano != all e mes != all)
  if (filters.year !== 'all' && filters.month !== 'all') {
    const yearNum = parseInt(filters.year);
    const monthNum = parseInt(filters.month) - 1; // 0-indexed para Date
    const totalDays = new Date(yearNum, monthNum + 1, 0).getDate();

    // Mapear saldo líquido diário
    const dailyNet: Record<number, number> = {};
    for (let d = 1; d <= totalDays; d++) {
      dailyNet[d] = 0;
    }

    sorted.forEach((t) => {
      const day = parseInt(t.date.substring(8, 10));
      const val = Number(t.amount) || 0;
      const factor = t.type === 'INCOME' ? 1 : -1;
      if (dailyNet[day] !== undefined) {
        dailyNet[day] += val * factor;
      }
    });

    const data: Array<{ name: string; Saldo: number }> = [];
    let runningBalance = 0;

    for (let d = 1; d <= totalDays; d++) {
      runningBalance += dailyNet[d];
      data.push({
        name: `${String(d).padStart(2, '0')}/${filters.month}`,
        Saldo: parseFloat(runningBalance.toFixed(2)),
      });
    }

    return data;
  } else {
    // Caso seja "Todos" ou ano específico completo: agrupar por Mês/Ano (YYYY-MM)
    const monthlyNet: Record<string, number> = {};

    sorted.forEach((t) => {
      const monthYear = t.date.substring(0, 7); // YYYY-MM
      const val = Number(t.amount) || 0;
      const factor = t.type === 'INCOME' ? 1 : -1;
      monthlyNet[monthYear] = (monthlyNet[monthYear] || 0) + val * factor;
    });

    const sortedMonths = Object.keys(monthlyNet).sort();
    const data: Array<{ name: string; Saldo: number }> = [];
    let runningBalance = 0;

    // Converter YYYY-MM para MM/YY legível
    sortedMonths.forEach((m) => {
      runningBalance += monthlyNet[m];
      const [year, month] = m.split('-');
      data.push({
        name: `${month}/${year.substring(2)}`,
        Saldo: parseFloat(runningBalance.toFixed(2)),
      });
    });

    // Se estiver vazio, fornecer um ponto zero
    if (data.length === 0) {
      data.push({ name: 'Sem dados', Saldo: 0 });
    }

    return data;
  }
};
