
import React from 'react';
import { VIPLevel } from './types';

export const VIP_DATA: VIPLevel[] = [
  { level: 1, name: 'VIP 1', price: 1000, daily_profit: 200, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop' },
  { level: 2, name: 'VIP 2', price: 5000, daily_profit: 1100, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop' },
  { level: 3, name: 'VIP 3', price: 15000, daily_profit: 3500, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1614850523598-81148400c731?q=80&w=400&auto=format&fit=crop' },
  { level: 4, name: 'VIP 4', price: 30000, daily_profit: 7500, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1614851012101-8378393521d6?q=80&w=400&auto=format&fit=crop' },
  { level: 5, name: 'VIP 5', price: 60000, daily_profit: 15500, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=400&auto=format&fit=crop' },
  { level: 6, name: 'VIP 6', price: 120000, daily_profit: 33000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&auto=format&fit=crop' },
  { level: 7, name: 'VIP 7', price: 240000, daily_profit: 70000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=400&auto=format&fit=crop' },
  { level: 8, name: 'VIP 8', price: 480000, daily_profit: 160000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=400&auto=format&fit=crop' },
  { level: 9, name: 'VIP 9', price: 960000, daily_profit: 380000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=400&auto=format&fit=crop' },
  { level: 10, name: 'VIP 10', price: 1800000, daily_profit: 800000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop' },
  { level: 11, name: 'VIP 11', price: 3500000, daily_profit: 1500000, tasks_per_day: 1, validity_days: 200, image_url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=400&auto=format&fit=crop' },
];

export const toBanglaNum = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
};

export const formatCurrency = (amount: number): string => {
  return `৳${toBanglaNum(amount.toLocaleString())}`;
};

export const BANGLA_NUM_MAP: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};
