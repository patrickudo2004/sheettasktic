export type Task = {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string; // Should be parsable date string
  priority?: 'low' | 'medium' | 'high';
  status?: string;
  parentTask?: string;
};

export type Mapping = {
  title: string[];
  notes: string[];
  dueDate: string[];
  priority: string[];
  status: string[];
  parentTask: string[];
};

export type SheetData = {
  headers: string[];
  rows: (string | number | boolean)[][];
};
