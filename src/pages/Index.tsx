"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Target, 
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import GoalCard from '@/components/GoalCard';
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

const IndexPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Vacation Fund',
      targetAmount: 2000,
      currentAmount: 1500,
      deadline: '2024-12-31',
      category: 'Travel',
      isCompleted: false,
      imageUrl: '/images/vacation.jpg'
    },
    {
      id: '2',
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 5000,
      deadline: '2024-12-31',
      category: 'Emergency',
      isCompleted: true,
      imageUrl: '/images/emergency.jpg'
    },
    {
      id: '3',
      title: 'New Laptop',
      targetAmount: 1200,
      currentAmount: 800,
      deadline: '2024-06-30',
      category: 'Tech',
      isCompleted: false,
      imageUrl: '/images/laptop.jpg'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: 0,
    deadline: '',
    category: ''
  });

  const handleDeposit = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: goal.currentAmount + amount }
        : goal
    ));
  };

  const handleWithdraw = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: goal.currentAmount - amount }
        : goal
    ));
  };

  const handleGoalComplete = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, isCompleted: true }
        : goal
    ));
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
        isCompleted: false,
        imageUrl: '/images/default.jpg'
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', targetAmount: 0, deadline: '', category: '' });
    }
  };

  const completedGoals = goals.filter(goal => goal.isCompleted);
  const activeGoals = goals.filter(goal => !goal.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">FocusFund</h1>
          <p className="text-gray-600">Your smart savings journey</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onGoalComplete={handleGoalComplete}
            />
          ))}
        </div>

        {completedGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              Completed Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  onGoalComplete={handleGoalComplete}
                />
              ))}
            </div>
          </div>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Title</label>
                <Input
                  placeholder="Enter goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <Input
                  type="number"
                  placeholder="Target amount"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  placeholder="Category (e.g. Travel, Tech)"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleAddGoal} className="w-full">
              Create Goal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;