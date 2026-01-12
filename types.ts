
export interface Student {
  matricNo: string;
  surname: string;
  firstName: string;
  otherName: string;
  password?: string;
  pin?: string;
  isBiometricEnrolled?: boolean;
  setupComplete?: boolean;
}

export interface UserProfile {
  currentGPA: number;
  targetGPA: number;
  coursesCompleted: number;
  totalCourses: number;
  creditsEarned: number;
  totalCreditsRequired: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: 'academic' | 'personal' | 'extracurricular';
  reminder: boolean;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  progress: number;
  category: 'academic' | 'personal';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export enum BotType {
  ACADEMIC = 'Academic Advisor',
  CAREER = 'Career Counselor',
  FINANCE = 'Personal Finance'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Student | null;
  stage: 'login' | 'setup' | 'dashboard';
}
