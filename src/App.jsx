import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { formatCurrency } from './utils/helpers';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { SourceManagement } from './components/SourceManagement';
import { SourceAnalytics, MonthlyTrendChart, SourceComparisonChart } from './components/Analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App = () => {
  // Initialize state with localStorage
  const [sources, setSources] = useLocalStorage('sources', {
    cash: { 
      id: 'cash', 
      name: 'Cash', 
      balance: 0,
      color: '#0088FE'
    },
    bankAccounts: { 
      id: 'bankAccounts', 
      name: 'Bank Accounts', 
      balance: 0,
      color: '#00C49F'
    },
    digitalWallets: { 
      id: 'digitalWallets', 
      name: 'Digital Wallets', 
      balance: 0,
      color: '#FFBB28'
    },
  });

  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate total balance
  const totalBalance = Object.values(sources).reduce(
    (sum, source) => sum + (parseFloat(source.balance) || 0),
    0
  );

  // Prepare data for pie chart
  const pieData = Object.values(sources)
    .filter(source => source.balance > 0)
    .map(source => ({
      name: source.name,
      value: parseFloat(source.balance) || 0,
      color: source.color
    }));

  // Transaction handlers
  const handleTransaction = (transaction) => {
    // Add new transaction to list
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Add unique ID
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);

    // Update source balance
    setSources(prev => ({
      ...prev,
      [transaction.source]: {
        ...prev[transaction.source],
        balance: prev[transaction.source].balance + transaction.amount
      }
    }));
  };

  // Source management handlers
  const handleAddSource = (sourceData) => {
    setSources(prev => ({
      ...prev,
      [sourceData.id]: {
        ...sourceData,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
      }
    }));
  };

  const handleUpdateSource = (sourceData) => {
    setSources(prev => ({
      ...prev,
      [sourceData.id]: {
        ...prev[sourceData.id],
        ...sourceData
      }
    }));
  };

  const handleDeleteSource = (sourceId) => {
    if (transactions.some(t => t.source === sourceId)) {
      alert('Cannot delete source with existing transactions');
      return;
    }
    setSources(prev => {
      const newSources = { ...prev };
      delete newSources[sourceId];
      return newSources;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Money Manager</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Total Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Source Cards */}
              {Object.values(sources).map((source) => (
                <Card key={source.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{source.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(source.balance)}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Distribution Chart */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Fund Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="col-span-full">
                <TransactionList 
                  transactions={transactions.slice(0, 5)} 
                  sources={sources}
                />
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="space-y-6">
              <TransactionList 
                transactions={transactions} 
                sources={sources}
              />
            </div>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources">
            <SourceManagement
              sources={sources}
              onAddSource={handleAddSource}
              onUpdateSource={handleUpdateSource}
              onDeleteSource={handleDeleteSource}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthlyTrendChart transactions={transactions} />
              <SourceComparisonChart 
                sources={sources} 
                transactions={transactions}
              />
              {Object.values(sources).map((source) => (
                <SourceAnalytics
                  key={source.id}
                  source={source}
                  transactions={transactions}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Transaction Button */}
        <Button 
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-4 right-4 shadow-lg"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>

        {/* Transaction Form Modal */}
        <TransactionForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleTransaction}
          sources={sources}
        />
      </main>
    </div>
  );
};

export default App;