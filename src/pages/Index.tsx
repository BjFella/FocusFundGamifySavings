"use client";

import React, { useState } from 'react';
import { GoalCard } from '@/components/GoalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
}

const Index = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'New Car',
      targetAmount: 10000,
      currentAmount: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Vacation',
      targetAmount: 2500,
      currentAmount: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1503220317375-aaad66543020?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2800,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
    }
  ]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalImage, setNewGoalImage] = useState('');
  const [isAddGoalExpanded, setIsAddGoalExpanded] = useState(true);

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalAmount || isNaN(parseFloat(newGoalAmount))) {
      toast.error('Please enter valid goal details');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName.trim(),
      targetAmount: parseFloat(newGoalAmount),
      currentAmount: 0,
      imageUrl: newGoalImage || 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=200&fit=crop'
    };

    setGoals([...goals, newGoal]);
    setNewGoalName('');
    setNewGoalAmount('');
    setNewGoalImage('');
    toast.success('Goal added successfully!');
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: goal.currentAmount + amount }
        : goal
    ));
    toast.success(`Deposited $${amount.toFixed(2)} successfully!`);
  };

  const handleWithdraw = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id && goal.currentAmount >= amount
        ? { ...goal, currentAmount: goal.currentAmount - amount }
        : goal
    ));
    toast.success(`Withdrew $${amount.toFixed(2)} successfully!`);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal deleted successfully!');
  };

  const handleEditGoal = (id: string, newName: string, newTargetAmount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, name: newName, targetAmount: newTargetAmount }
        : goal
    ));
    toast.success('Goal updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Goal Tracker</h1>
          <p className="text-slate-400">Track your savings goals and reach your targets</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onDelete={handleDelete}
              onEditGoal={handleEditGoal}
            />
          ))}
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Goal
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddGoalExpanded(!isAddGoalExpanded)}
                className="text-white hover:bg-slate-700"
              >
                {isAddGoalExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {isAddGoalExpanded && (
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Goal name"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Target amount"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Input
                  placeholder="Image URL (optional)"
                  value={newGoalImage}
                  onChange={(e) => setNewGoalImage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleAddGoal}
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all"
              >
                Add Goal
              </Button>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white">Total Goals</p>
                  <p className="text-2xl font-bold text-white">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <TrendingDown className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white">Total Saved</p>
                  <p className="text-2xl font-bold text-white">
                    ${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white">Total Target</p>
                  <p className="text-2xl font-bold text-white">
                    ${goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;