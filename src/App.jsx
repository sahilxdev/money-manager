import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Initial sources data structure
const initialSources = {
  cash: { 
    id: 'cash', 
    name: 'Cash', 
    balance: 0, 
    iconName: 'Coins',
    color: '#0088FE'
  },
  bankAccounts: { 
    id: 'bankAccounts', 
    name: 'Bank Accounts', 
    balance: 0, 
    iconName: 'CreditCard',
    color: '#00C49F'
  },
  digitalWallets: { 
    id: 'digitalWallets', 
    name: 'Digital Wallets', 
    balance: 0, 
    iconName: 'Wallet',
    color: '#FFBB28'
  },
};

const App = () => {
  // Initialize state with localStorage or default values
  const [sources, setSources] = useState(() => {
    try {
      const savedSources = localStorage.getItem('sources');
      return savedSources ? JSON.parse(savedSources) : initialSources;
    } catch (error) {
      console.error('Error loading sources from localStorage:', error);
      return initialSources;
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  
  // Save to localStorage whenever sources change
  useEffect(() => {
    try {
      localStorage.setItem('sources', JSON.stringify(sources));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [sources]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Money Manager</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Total Balance Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.values(sources).map((source) => (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {source.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(source.balance)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Distribution Chart */}
        <Card className="mb-6">
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

        {/* Add Transaction Button */}
        <Button 
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-4 right-4 shadow-lg"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </main>
    </div>
  );
};

export default App;