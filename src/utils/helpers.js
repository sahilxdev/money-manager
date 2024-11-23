export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };
  
  export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  export const calculateSourceMetrics = (transactions, sourceId) => {
    const sourceTransactions = transactions.filter(t => t.source === sourceId);
    const totalIncome = sourceTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(sourceTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    return {
      totalTransactions: sourceTransactions.length,
      totalIncome,
      totalExpense,
      netFlow: totalIncome - totalExpense
    };
  };
  
  export const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(transaction);
      return groups;
    }, {});
  };