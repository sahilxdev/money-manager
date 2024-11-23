import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency, calculateSourceMetrics, groupTransactionsByMonth } from '../utils/helpers';

export const SourceAnalytics = ({ source, transactions }) => {
  const metrics = calculateSourceMetrics(transactions, source.id);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{source.name} Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalIncome)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics.totalExpense)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Net Flow</p>
            <p className={`text-2xl font-bold ${metrics.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netFlow)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MonthlyTrendChart = ({ transactions }) => {
  const monthlyData = Object.entries(groupTransactionsByMonth(transactions))
    .map(([month, txs]) => ({
      month,
      income: txs.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      expense: Math.abs(txs.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
    }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const SourceComparisonChart = ({ sources, transactions }) => {
  const sourceData = Object.values(sources).map(source => {
    const metrics = calculateSourceMetrics(transactions, source.id);
    return {
      name: source.name,
      income: metrics.totalIncome,
      expense: metrics.totalExpense
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Source Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sourceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="income" fill="#10B981" name="Income" />
            <Bar dataKey="expense" fill="#EF4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};