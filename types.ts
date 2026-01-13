
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  PROFIT = 'PROFIT',
  COMMISSION = 'COMMISSION'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum SupportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  total_balance: number;
  withdrawable_balance: number;
  active_vip: number | null;
  vip_expiry_date: string | null;
  referrer_id: string | null;
  withdraw_pin: string | null;
  is_blocked: boolean;
  isAdmin: boolean;
  last_task_completed_at: string | null;
  created_at: string;
}

export interface VIPLevel {
  level: number;
  name: string;
  price: number;
  daily_profit: number;
  tasks_per_day: number;
  validity_days: number;
  image_url?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  created_at: string;
  details?: string;
}

export interface SupportToken {
  id: string;
  user_id: string;
  username: string;
  subject: string;
  message: string;
  status: SupportStatus;
  created_at: string;
}

export interface TaskHistory {
  id: string;
  user_id: string;
  vip_level: number;
  profit: number;
  completed_at: string;
}

export interface AppConfig {
  minWithdrawal: number;
}
