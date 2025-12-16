"use client";

import React from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderProps {
  totalSavings: number;
  showAddForm: boolean;
  onToggleAddForm: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const Header = ({ totalSavings, showAddForm, onToggleAddForm }: HeaderProps) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            FocusFund
          </h1>
          <p className="text-slate-400 mt-1">Gamified Savings Tracker</p>
        </div>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-900 rounded-lg">
              <PiggyBank className="text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Savings</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalSavings)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onToggleAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all"
        >
          <Plus size={20} />
          {showAddForm ? 'Cancel' : 'Add New Goal'}
        </Button>
      </div>
    </header>
  );
};