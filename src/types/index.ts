export type UserRole = 'customer' | 'agent' | 'administrator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
}

export interface Policy {
  id: string;
  customerId: string;
  customerName?: string;
  agentId: string;
  agentName?: string;
  type: 'life' | 'health' | 'auto' | 'home' | 'business';
  policyNumber: string;
  premium: number;
  coverage: number;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
  documents?: Document[];
}

export interface Claim {
  id: string;
  policyId: string;
  customerId: string;
  customerName?: string;
  agentId?: string;
  agentName?: string;
  type: Policy['type'];
  claimNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'settled';
  description: string;
  incidentDate: string;
  submittedDate: string;
  processedDate?: string;
  documents?: Document[];
}

export interface Payment {
  id: string;
  policyId: string;
  customerId: string;
  amount: number;
  type: 'premium' | 'claim';
  status: 'completed' | 'pending' | 'failed';
  method: 'credit_card' | 'bank_transfer' | 'check';
  date: string;
  dueDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  policies: Policy[];
  claims: Claim[];
  payments: Payment[];
  users: User[];
  loading: boolean;
  error: string | null;
}