"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Minus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
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

export const GoalCard = ({ 
  goal, 
  onDeposit, 
  onWithdraw, 
  onDelete, 
  onEditGoal 
}: GoalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const [editTargetAmount, setEditTargetAmount] = useState(goal.targetAmount.toString());
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editName.trim() || isNaN(parseFloat(editTargetAmount))) {
      toast.error('Please enter valid goal details');
      return;
    }

    let imageUrl = goal.imageUrl;
    if (editImage) {
      // In a real app, you would upload the file to a server and get the URL
      // For this demo, we'll use the preview URL
      imageUrl = imagePreview || imageUrl;
    }

    onEditGoal(goal.id, editName.trim(), parseFloat(editTargetAmount));
    setIsEditing(false);
    setEditImage(null);
    setImagePreview(null);
    toast.success('Goal updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setEditImage(null);
    setImagePreview(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      onDelete(goal.id);
      toast.success('Goal deleted successfully!');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isEditing) {
    return (
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div>
            <Input
              placeholder="Goal name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Target amount"
              value={editTargetAmount}
              onChange={(e) => setEditTargetAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Goal Image
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-slate-700 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-600 file:text-white hover:file:bg-slate-500 w-full"
              />
              {imagePreview && (
                <div className="flex-shrink-0">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 border-slate-600 text-white hover:bg-slate-700"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="relative">
        <img 
          src={goal.imageUrl} 
          alt={goal.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{goal.name}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Progress</span>
            <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">
            {Math.round(progress)}% complete
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onWithdraw(goal.id, 100)}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDeposit(goal.id, 100)}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};