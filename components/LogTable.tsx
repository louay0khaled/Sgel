import React from 'react';
import type { LogEntry } from '../types';
import AutosizeInput from './AutosizeInput';

interface LogTableProps {
  entries: LogEntry[];
  onCellChange: (id: number, field: 'name' | 'capacity' | 'vehicleType' | 'notes', value: string) => void;
  onTimeLog: (id: number, type: 'entry' | 'exit') => void;
}

const LogTable: React.FC<LogTableProps> = ({ entries, onCellChange, onTimeLog }) => {
  const headers = ['الاسم', 'ساعة الدخول', 'ساعة الخروج', 'الصفة', 'نوع المركبة', 'ملاحظات'];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, id: number, field: 'name' | 'capacity' | 'vehicleType' | 'notes') => {
    onCellChange(id, field, e.target.value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full spreadsheet">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <AutosizeInput
                  value={entry.name}
                  onChange={(e) => handleInputChange(e, entry.id, 'name')}
                />
              </td>
              <td 
                className={`cursor-pointer hover:bg-gray-100 transition-colors ${entry.entryTime ? 'time-cell-filled' : ''}`}
                onClick={() => onTimeLog(entry.id, 'entry')}
              >
                {entry.entryTime || ':'}
              </td>
              <td 
                className={`cursor-pointer hover:bg-gray-100 transition-colors ${entry.exitTime ? 'time-cell-filled' : ''}`}
                onClick={() => onTimeLog(entry.id, 'exit')}
              >
                {entry.exitTime || ':'}
              </td>
              <td>
                <AutosizeInput
                  value={entry.capacity}
                  onChange={(e) => handleInputChange(e, entry.id, 'capacity')}
                />
              </td>
              <td>
                <AutosizeInput
                  value={entry.vehicleType}
                  onChange={(e) => handleInputChange(e, entry.id, 'vehicleType')}
                />
              </td>
              <td>
                <AutosizeInput
                  value={entry.notes}
                  onChange={(e) => handleInputChange(e, entry.id, 'notes')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;