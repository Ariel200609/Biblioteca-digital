const DEFAULT_BASE_URL = 'http://localhost:3000/api';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || DEFAULT_BASE_URL;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`DELETE ${path} failed: ${res.status}`);
}

// Shared types (frontend mirrors backend shapes)
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'READER';
  isActive?: boolean;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available?: boolean;
};

export type Loan = {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string | Date;
  dueDate: string | Date;
  status: 'active' | 'overdue' | 'returned' | 'cancelled';
  renewalCount: number;
};

export type LoanWithDetails = Loan & {
  book?: { title: string; author: string } | undefined;
  user?: { name: string; email: string };
};

export type ActiveLoansReport = {
  totalActiveLoans: number;
  loans: Array<{ loanId: string; bookId: string; userId: string; dueDate: string | Date; isOverdue: boolean }>;
};

export type ActiveUsersReport = {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithOverdueLoans: number;
};

export type BookStatisticsReport = {
  totalBooks: number;
  availableBooks: number;
  loanedBooks: number;
  mostBorrowedBooks: Array<{ bookId: string; timesLoaned: number }>;
  overdueBooks: number;
};


