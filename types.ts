
export interface LogEntry {
  id: number;
  name: string;
  entryTime: string | null;
  exitTime: string | null;
  capacity: string;
  vehicleType: string;
  notes: string;
}

export interface AllLogs {
  [date: string]: LogEntry[];
}
