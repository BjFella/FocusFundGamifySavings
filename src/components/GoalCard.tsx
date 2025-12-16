"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';

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

export const GoalCard = ({ goal, onDeposit, onWithdraw, onDelete }: GoalCardProps) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showDepositInput, setShowDepositInput] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const handleDeposit = () => {
    if (depositAmount && !isNaN(parseFloat(depositAmount))) {
      onDeposit(goal.id, parseFloat(depositAmount));
      setDepositAmount('');
      setShowDepositInput(false);
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount && !isNaN(parseFloat(withdrawAmount))) {
      onWithdraw(goal.id, parseFloat(withdrawAmount));
      setWithdrawAmount('');
      setShowWithdrawInput(false);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(goal.id);
      setIsDeleting(false);
    }, 300);
  };

  // Calculate blur and grayscale based on progress
  const blurValue = Math.max(0, 10 - progressPercentage / 10);
  const grayscaleValue = Math.max(0, 100 - progressPercentage);

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <div 
          className="h-48 w-full bg-cover bg-center transition-all duration-500"
          style={{ 
            backgroundImage: `url(${goal.imageUrl})`,
            filter: `blur(${blurValue}px) grayscale(${grayscaleValue}%)`
          }}
        />
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end justify-center p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-400 mb-2">COMPLETED!</h3>
              <p className="text-slate-300">Goal reached successfully</p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{goal.name}</h3>
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500/20 rounded-full scale-110"></div>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-400 transition-colors relative z-10"
              aria-label="Delete goal"
              disabled={isDeleting}
            >
              <Trash2 size={20} />
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {isCompleted ? (
          <div className="text-center py-4">
            <p className="text-green-400 font-medium">Goal has been completed!</p>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDepositInput(!showDepositInput)}
              variant="default"
              className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all"
            >
              <Plus size={16} className="mr-2" />
              Deposit
            </Button>
            <Button
              onClick={() => setShowWithdrawInput(!showWithdrawInput)}
              variant="secondary"
              className="flex-1 text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <Minus size={16} className="mr-2" />
              Withdraw
            </Button>
          </div>
        )}

        {showDepositInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
            <Button
              onClick={handleDeposit}
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all"
            >
              Confirm
            </Button>
          </div>
        )}

        {showWithdrawInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
            <Button
              onClick={handleWithdraw}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 transition-all"
            >
              Confirm
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};