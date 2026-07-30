export type Item = {
  id: string;
  name: string;
  category: string | null;
  checked: boolean;
  added_by: string | null;
  created_at: string;
  checked_at: string | null;
};

export type Habit = {
  name_key: string;
  name: string;
  avg_interval_seconds: number;
  last_purchase: string;
  purchase_count: number;
  seconds_since_last_purchase: number;
};
