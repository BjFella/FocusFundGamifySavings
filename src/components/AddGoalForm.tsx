"use client";

import React, { useState, useRef } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface AddGoalFormProps {
  onAddGoal: (goal: { name: string; targetAmount: number; imageUrl: string }) => void;
  onCancel: () => void;
}

export const AddGoalForm = ({ onAddGoal, onCancel }: AddGoalFormProps) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // In a real app, you would upload to a service here
      // For this demo, we'll just use a FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
      setImagePreview(null);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <Card className="bg-slate-800 border-slate-700 mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-purple-400" />
            Add New Goal
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            aria-label="Close form"
          >
            <X size={24} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Goal Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gaming PC"
              required
              className="bg-slate-700 border-slate-600 focus:border-purple-500 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Target Amount ($)</label>
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g. 2500"
              min="1"
              step="1"
              required
              className="bg-slate-700 border-slate-600 focus:border-purple-500 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Image</label>
            
            {imagePreview ? (
              <div className="relative mb-3">
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    draggable={false}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 text-white"
                >
                  <Upload size={16} />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            )}
            
            <div className="mt-2 text-center text-sm text-gray-400">or</div>
            
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-slate-700 border-slate-600 focus:border-purple-500 text-white mt-2"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!name || !targetAmount || !imageUrl}
              className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all disabled:opacity-50 text-white"
            >
              Add Goal
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="flex-1 text-slate-900"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};