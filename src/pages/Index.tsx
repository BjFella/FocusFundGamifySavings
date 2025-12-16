"use client";

import React, { useState, useEffect } from 'react';
import { GoalCard } from '@/components/GoalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, TrendingDown, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

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
      name: 'Motorcycle',
      targetAmount: 2500,
      currentAmount: 0,
      imageUrl: 'https://imgur.com/f5951e6f-92f8-4a23-a182-765d25b1d447'
    },
    {
      id: '2',
      name: 'Best Car Ever',
      targetAmount: 2500,
      currentAmount: 650,
      imageUrl: 'https://imgur.com/70e95cfa-b65c-4196-97c5-ef440645e4da'
    },
    {
      id: '3',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2800,
      imageUrl: 'https://imgur.com/12703b6f-7fa3-472a-b1ef-a35d9cc90004'
    }
  ]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalImage, setNewGoalImage] = useState<File | null>(null);
  const [isAddGoalExpanded, setIsAddGoalExpanded] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lifetimeStats, setLifetimeStats] = useState({
    totalGoalsCreated: 0,
    totalGoalsCompleted: 0,
    totalSaved: 0,
    totalDeposits: 0,
    totalWithdrawals: 0
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Try loading from Electron file system first
      if (window.electronAPI) {
        try {
          const data = await window.electronAPI.getData();
          if (data) {
            if (data.goals) setGoals(data.goals);
            if (data.lifetimeStats) setLifetimeStats(data.lifetimeStats);
            return; // Exit if data loaded from file
          }
        } catch (error) {
          console.error("Failed to load data from file:", error);
        }
      }

      // Fallback to localStorage if no file data or not in Electron
      const savedStats = localStorage.getItem('lifetimeStats');
      if (savedStats) {
        setLifetimeStats(JSON.parse(savedStats));
      }
      // Note: Goals were not previously saved to localStorage, so we keep defaults if no file data
    };
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (window.electronAPI) {
        await window.electronAPI.saveData({ goals, lifetimeStats });
      }
      // Always save stats to localStorage as backup/web support
      localStorage.setItem('lifetimeStats', JSON.stringify(lifetimeStats));
    };
    saveData();
  }, [goals, lifetimeStats]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewGoalImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalAmount || isNaN(parseFloat(newGoalAmount))) {
      toast.error('Please enter valid goal details');
      return;
    }

    // Generate image URL from file or use default
    let imageUrl = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=200&fit=crop';
    if (newGoalImage) {
      // In a real app, you would upload the file to a server and get the URL
      // For this demo, we'll just use the preview URL
      imageUrl = imagePreview || imageUrl;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName.trim(),
      targetAmount: parseFloat(newGoalAmount),
      currentAmount: 0,
      imageUrl
    };

    setGoals([...goals, newGoal]);
    setNewGoalName('');
    setNewGoalAmount('');
    setNewGoalImage(null);
    setImagePreview(null);

    // Update lifetime stats
    setLifetimeStats(prev => ({
      ...prev,
      totalGoalsCreated: prev.totalGoalsCreated + 1
    }));

    toast.success('Goal added successfully!');
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, currentAmount: goal.currentAmount + amount }
        : goal
    ));

    // Check for goal completion
    const goal = goals.find(g => g.id === id);
    if (goal && goal.currentAmount < goal.targetAmount && (goal.currentAmount + amount) >= goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Goal Completed! 🎉');
    }

    // Update lifetime stats
    setLifetimeStats(prev => ({
      ...prev,
      totalDeposits: prev.totalDeposits + 1,
      totalSaved: prev.totalSaved + amount
    }));

    toast.success(`Deposited $${amount.toFixed(2)} successfully!`);
  };

  const handleWithdraw = (id: string, amount: number) => {
    setGoals(goals.map(goal =>
      goal.id === id && goal.currentAmount >= amount
        ? { ...goal, currentAmount: goal.currentAmount - amount }
        : goal
    ));

    // Update lifetime stats
    setLifetimeStats(prev => ({
      ...prev,
      totalWithdrawals: prev.totalWithdrawals + 1,
      totalSaved: prev.totalSaved - amount
    }));

    toast.success(`Withdrew $${amount.toFixed(2)} successfully!`);
  };

  const handleDelete = (id: string) => {
    // Get the goal being deleted to update lifetime stats
    const deletedGoal = goals.find(goal => goal.id === id);
    if (deletedGoal) {
      // Update lifetime stats based on goal completion
      if (deletedGoal.currentAmount >= deletedGoal.targetAmount) {
        setLifetimeStats(prev => ({
          ...prev,
          totalGoalsCompleted: prev.totalGoalsCompleted + 1
        }));
      }
    }

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

  const resetLifetimeStats = () => {
    setLifetimeStats({
      totalGoalsCreated: 0,
      totalGoalsCompleted: 0,
      totalSaved: 0,
      totalDeposits: 0,
      totalWithdrawals: 0
    });
    toast.success('Lifetime stats reset successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">

          {/* Header Area: 2x1 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Focus Fund</h1>
            <p className="text-slate-400">Gamify your savings • Reach your targets</p>
          </div>

          {/* Key Stat: Total Saved: 1x1 */}
          <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16 text-green-400" />
            </div>
            <p className="text-slate-400 font-medium">Total Saved</p>
            <p className="text-3xl font-bold text-white mt-1">
              ${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toFixed(2)}
            </p>
            <div className="mt-4 h-1 w-full bg-slate-700 rounded-full">
              <div className="h-1 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
              {/* Simplified progress bar visual */}
            </div>
          </div>

          {/* Key Stat: Active Goals: 1x1 */}
          <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-slate-400 font-medium">Active Goals</p>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-2">{goals.length}</p>
          </div>

          {/* Add Goal Tile: 1x2 (Tall) */}
          <div className={`col-span-1 row-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${isAddGoalExpanded ? '' : 'h-min'}`}>
            <div
              className="p-6 cursor-pointer hover:bg-slate-700/50 transition-colors flex justify-between items-center"
              onClick={() => setIsAddGoalExpanded(!isAddGoalExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">New Goal</h3>
              </div>
              {isAddGoalExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>

            {isAddGoalExpanded && (
              <div className="p-6 pt-0 space-y-4 flex-1">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 block">Name</label>
                  <Input
                    placeholder="e.g. Dream Vacation"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 block">Target</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 block">Cover Image</label>
                  <div
                    className="relative w-full h-32 bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden hover:border-slate-500 transition-colors cursor-pointer group"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-2xl mb-1 block">📷</span>
                        <span className="text-xs text-slate-400">Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleAddGoal}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/20"
                >
                  Create Goal
                </Button>
              </div>
            )}
          </div>

          {/* Goals: Mapped directly into the grid */}
          {goals.map(goal => (
            <div key={goal.id} className="col-span-1">
              <GoalCard
                goal={goal}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onDelete={handleDelete}
                onEditGoal={handleEditGoal}
              />
            </div>
          ))}

          {/* Lifetime Stats: Full Width (bottom) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white text-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Lifetime Achievement
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetLifetimeStats}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Created</p>
                    <p className="text-xl font-bold text-white">{lifetimeStats.totalGoalsCreated}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Completed</p>
                    <p className="text-xl font-bold text-green-400">{lifetimeStats.totalGoalsCompleted}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Saved</p>
                    <p className="text-xl font-bold text-white">${lifetimeStats.totalSaved.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Deposits</p>
                    <p className="text-xl font-bold text-white">{lifetimeStats.totalDeposits}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-slate-500 text-xs uppercase tracking-wide">Withdrawals</p>
                    <p className="text-xl font-bold text-white">{lifetimeStats.totalWithdrawals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;