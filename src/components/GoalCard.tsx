"use client";

import React, { useState } from 'react';
import { Trash2, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
}

interface GoalCardProps {
  goal: Goal;
  onDeposit: (id: string, amount: number) => void;
  onWithdraw: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

const calculateClarity = (current: number, target: number) => {
  const ratio = Math.min(current / target, 1);
  const blur = 10 - (ratio * 10);
  const grayscale = 100 - (ratio * 100);
  return { blur, grayscale };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProgressBar = ({ current, target }: { current: number; target: number }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div 
        className="bg-gradient-to-r from-purple-500 to-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const GoalCard = ({ goal, onDeposit, onWithdraw, onDelete }: GoalCardProps) => {
  const { blur, grayscale } = calculateClarity(goal.currentAmount, goal.targetAmount);
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = percentage >= 100;
  
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState<'deposit' | 'withdraw' | null>(null);
  
  const handleCustomAmount = (type: 'deposit' | 'withdraw') => {
    setActionType(type);
    setShowCustomAmount(true);
  };
  
  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      if (actionType === 'deposit') {
        onDeposit(goal.id, value);
      } else if (actionType === 'withdraw') {
        onWithdraw(goal.id, value);
      }
      setAmount('');
      setShowCustomAmount(false);
      setActionType(null);
    }
  };
  
  const handleCancel = () => {
    setAmount('');
    setShowCustomAmount(false);
    setActionType(null);
  };
  
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 shadow-lg flex flex-col h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="relative overflow-hidden rounded-lg mb-4 flex-grow">
          <div className="relative w-full" style={{ paddingBottom: '100%' }}>
            <img 
              src={goal.imageUrl} 
              alt={goal.name}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              style={{
                filter: `grayscale(${grayscale}%) blur(${blur}px)`
              }}
              draggable={false}
            />
            {isCompleted && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center p-2 bg-purple-900 rounded-lg">
                  <span className="text-green-400 font-bold text-lg">COMPLETED!</span>
                </div>
              </div>
            )}
            
            <Button
              onClick={() => onDelete(goal.id)}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full"
              aria-label="Delete goal"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 truncate">{goal.name}</h3>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <ProgressBar current={goal.currentAmount} target={goal.targetAmount} />
          <div className="text-right text-xs text-gray-400 mt-1">
            {percentage.toFixed(1)}% funded
          </div>
        </div>
        
        {showCustomAmount ? (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="mb-3">
              <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="1"
                className="bg-slate-700 border-slate-600 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 transition-colors"
              >
                {actionType === 'deposit' ? (
                  <>
                    <ArrowUp size={16} className="mr-1" />
                    Deposit
                  </>
                ) : (
                  <>
                    <ArrowDown size={16} className="mr-1" />
                    Withdraw
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleCustomAmount('deposit')}
              className="flex-1 bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowUp size={16} />
              Deposit
            </Button>
            <Button
              onClick={() => handleCustomAmount('withdraw')}
              className="flex-1 bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowDown size={16} />
              Withdraw
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};