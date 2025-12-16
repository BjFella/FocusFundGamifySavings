"use client";

import React, { useState, useEffect } from 'react';
import { Plus, PiggyBank, Target, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MadeWithDyad } from '@/components/made-with-dyad';

// Types
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
}

// Helper functions
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

// Components
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

const GoalCard = ({ 
  goal, 
  onDeposit,
  onWithdraw
}: { 
  goal: Goal; 
  onDeposit: (id: string, amount: number) => void;
  onWithdraw: (id: string, amount: number) => void;
}) => {
  const { blur, grayscale } = calculateClarity(goal.currentAmount, goal.targetAmount);
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = percentage >= 100;
  
  const [showActions, setShowActions] = useState(false);
  const [amount, setAmount] = useState('');
  
  const handleDeposit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      onDeposit(goal.id, value);
      setAmount('');
      setShowActions(false);
    }
  };
  
  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && value <= goal.currentAmount) {
      onWithdraw(goal.id, value);
      setAmount('');
      setShowActions(false);
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-all duration-300 shadow-lg">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={goal.imageUrl} 
          alt={goal.name}
          className="w-full h-48 object-cover transition-all duration-500"
          style={{
            filter: `grayscale(${grayscale}%) blur(${blur}px)`
          }}
        />
        {isCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center p-2 bg-purple-900 rounded-lg">
              <span className="text-green-400 font-bold text-lg">COMPLETED!</span>
            </div>
          </div>
        )}
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
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setShowActions(!showActions)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
        >
          <Wallet size={16} />
          {showActions ? 'Cancel' : 'Manage'}
        </button>
      </div>
      
      {showActions && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="Enter amount"
              min="0"
              step="1"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeposit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Deposit
            </button>
            <button
              onClick={handleWithdraw}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AddGoalForm = ({ 
  onAddGoal, 
  onCancel 
}: { 
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && targetAmount && imageUrl) {
      onAddGoal({
        name,
        targetAmount: parseFloat(targetAmount),
        imageUrl
      });
      setName('');
      setTargetAmount('');
      setImageUrl('');
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Plus className="text-purple-400" />
        Add New Goal
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Goal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="e.g. Gaming PC"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Target Amount ($)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="e.g. 2500"
            min="1"
            step="1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
          >
            Add Goal
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const FocusFund = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState<Record<string, boolean>>({});
  
  // Initialize with demo goals
  useEffect(() => {
    const savedGoals = localStorage.getItem('focusFundGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      const demoGoals: Goal[] = [
        {
          id: '1',
          name: 'High-End Gaming PC',
          targetAmount: 2500,
          currentAmount: 300,
          imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: '2',
          name: 'Yamaha Bolt Motorcycle',
          targetAmount: 5000,
          currentAmount: 1200,
          imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }
      ];
      setGoals(demoGoals);
    }
  }, []);
  
  // Save to localStorage
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('focusFundGoals', JSON.stringify(goals));
    }
  }, [goals]);
  
  // Check for completed goals and trigger confetti
  useEffect(() => {
    goals.forEach(goal => {
      const percentage = goal.currentAmount / goal.targetAmount;
      if (percentage >= 1 && !hasTriggeredConfetti[goal.id]) {
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#bf00ff', '#00ff9d']
        });
        
        // Mark as triggered to prevent multiple confetti
        setHasTriggeredConfetti(prev => ({
          ...prev,
          [goal.id]: true
        }));
      }
    });
  }, [goals, hasTriggeredConfetti]);
  
  const addGoal = (newGoal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const goal: Goal = {
      id: Date.now().toString(),
      currentAmount: 0,
      ...newGoal
    };
    setGoals([...goals, goal]);
    setShowAddForm(false);
  };
  
  const deposit = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: goal.currentAmount + amount } 
        : goal
    ));
  };
  
  const withdraw = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.max(0, goal.currentAmount - amount) } 
        : goal
    ));
  };
  
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                FocusFund
              </h1>
              <p className="text-slate-400 mt-1">Gamified Savings Tracker</p>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-3">
              <div className="p-2 bg-purple-900 rounded-lg">
                <PiggyBank className="text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Savings</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalSavings)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              Add New Goal
            </button>
          </div>
        </header>
        
        {showAddForm && (
          <AddGoalForm 
            onAddGoal={addGoal} 
            onCancel={() => setShowAddForm(false)} 
          />
        )}
        
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="mx-auto text-slate-600 mb-4" size={64} />
            <h2 className="text-xl font-bold text-slate-400 mb-2">No Goals Yet</h2>
            <p className="text-slate-500">Add your first savings goal to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onDeposit={deposit}
                onWithdraw={withdraw}
              />
            ))}
          </div>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default FocusFund;