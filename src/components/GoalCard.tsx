"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, Edit3 } from 'lucide-react';

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
  onEditGoal: (id: string, newName: string, newTargetAmount: number) => void;
}

export const GoalCard = ({ goal, onDeposit, onWithdraw, onDelete, onEditGoal }: GoalCardProps) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showDepositInput, setShowDepositInput] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const [editTargetAmount, setEditTargetAmount] = useState(goal.targetAmount.toString());

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

  const handleEdit = () => {
    if (editName.trim() && !isNaN(parseFloat(editTargetAmount))) {
      onEditGoal(goal.id, editName.trim(), parseFloat(editTargetAmount));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setIsEditing(false);
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
        {isEditing ? (
          <div className="mb-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 mb-2 focus:border-purple-500 focus:outline-none"
            />
            <input
              type="number"
              value={editTargetAmount}
              onChange={(e) => setEditTargetAmount(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 mb-3 focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700 transition-all"
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-white">{goal.name}</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                  aria-label="Edit goal"
                >
                  <Edit3 size={20} />
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-400 transition-colors"
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

            {showDepositInput ? (
              <div className="mt-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <input
                  autoFocus
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDeposit();
                    if (e.key === 'Escape') {
                      setShowDepositInput(false);
                      setDepositAmount('');
                    }
                  }}
                  placeholder="Deposit Amount"
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none"
                />
                <Button
                  onClick={handleDeposit}
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700 transition-all"
                >
                  Confirm Deposit
                </Button>
                <Button
                  onClick={() => {
                    setShowDepositInput(false);
                    setDepositAmount('');
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            ) : showWithdrawInput ? (
              <div className="mt-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <input
                  autoFocus
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleWithdraw();
                    if (e.key === 'Escape') {
                      setShowWithdrawInput(false);
                      setWithdrawAmount('');
                    }
                  }}
                  placeholder="Withdraw Amount"
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none"
                />
                <Button
                  onClick={handleWithdraw}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 transition-all"
                >
                  Confirm Withdraw
                </Button>
                <Button
                  onClick={() => {
                    setShowWithdrawInput(false);
                    setWithdrawAmount('');
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              !isCompleted && (
                <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                  <Button
                    onClick={() => setShowDepositInput(true)}
                    variant="default"
                    className="w-full bg-green-100 hover:bg-green-700 text-green-800 hover:text-white transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    Deposit
                  </Button>
                  <Button
                    onClick={() => setShowWithdrawInput(true)}
                    variant="default"
                    className="w-full bg-red-100 hover:bg-red-700 text-red-800 hover:text-white transition-colors duration-300"
                  >
                    <Minus size={16} className="mr-2" />
                    Withdraw
                  </Button>
                </div>
              )
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};