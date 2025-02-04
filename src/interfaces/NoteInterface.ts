export interface Note {
  id: number;
  x: number;
  y: number;
  body: string;
  title: string;
  content: string;
  date: string;
  deleted?: boolean;
  styles?: Record<string, string | boolean>;
}
