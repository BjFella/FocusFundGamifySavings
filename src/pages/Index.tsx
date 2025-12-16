"use client";

import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalForm } from '@/components/AddGoalForm';
import { Header } from '@/components/Header';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
}

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
  
  const addGoal = (newGoal: { name: string; targetAmount: number; imageUrl: string }) => {
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
  
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Header 
          totalSavings={totalSavings} 
          showAddForm={showAddForm}
          onToggleAddForm={() => setShowAddForm(!showAddForm)}
        />
        
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
                onDelete={deleteGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusFund;