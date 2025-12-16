"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Minus, Trash2, Edit3, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const [editTargetAmount, setEditTargetAmount] = useState(goal.targetAmount.toString());

  const handleSave = () => {
    if (!editName.trim() || isNaN(parseFloat(editTargetAmount))) {
      toast.error('Please enter valid goal details');
      return;
    }
    
    onEditGoal(goal.id, editName.trim(), parseFloat(editTargetAmount));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setIsEditing(false);
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="relative h-48">
        <img 
          src={goal.imageUrl} 
          alt={goal.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{goal.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Progress</span>
            <span>${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${progressColor}`} 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-slate-400">
            <span className="font-medium text-white">${goal.currentAmount.toFixed(2)}</span> saved
          </div>
          <div className="text-sm text-slate-400">
            <span className="font-medium text-white">{Math.round(progress)}%</span> complete
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDeposit(goal.id, 10)}
          className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Deposit $10
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onWithdraw(goal.id, 10)}
          className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
        >
          <Minus className="w-4 h-4 mr-1" /> Withdraw $10
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
        >
          {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(goal.id)}
          className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
      
      {isEditing && (
        <div className="p-4 pt-0 border-t border-slate-700">
          <div className="mb-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 mb-2"
              placeholder="Goal name"
            />
            <input
              type="number"
              value={editTargetAmount}
              onChange={(e) => setEditTargetAmount(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              placeholder="Target amount"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};