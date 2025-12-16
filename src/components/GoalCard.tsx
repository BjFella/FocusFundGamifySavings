"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  MinusCircle, 
  CheckCircle, 
  Calendar,
  Target,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category?: string;
  isCompleted: boolean;
  imageUrl?: string;
}

interface GoalCardProps {
  goal: Goal;
  onDeposit: (goalId: string, amount: number) => void;
  onWithdraw: (goalId: string, amount: number) => void;
  onGoalComplete: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDeposit, onWithdraw, onGoalComplete }) => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isGoalReached = goal.isCompleted || progress >= 100;

  const handleDeposit = () => {
    if (depositAmount > 0) {
      onDeposit(goal.id, depositAmount);
      setDepositAmount(0);
      setIsDepositModalOpen(false);
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount > 0 && withdrawAmount <= goal.currentAmount) {
      onWithdraw(goal.id, withdrawAmount);
      setWithdrawAmount(0);
      setIsWithdrawModalOpen(false);
    }
  };

  const handleCompleteGoal = () => {
    onGoalComplete(goal.id);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{goal.title}</span>
          {goal.category && (
            <Badge variant="secondary">{goal.category}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {isGoalReached ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Goal Completed!</span>
            </div>
            <p className="text-sm text-green-600">
              You've reached your target of {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button 
              onClick={() => setIsDepositModalOpen(true)}
              className="flex-1"
              variant="default"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1"
              variant="outline"
            >
              <MinusCircle className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        )}
        
        {goal.deadline && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Deposit to Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setIsDepositModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeposit}
                  className="flex-1"
                >
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Withdraw from Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount || ''}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div className="text-sm text-gray-500">
                Available: {formatCurrency(goal.currentAmount)}
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdraw}
                  className="flex-1"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;