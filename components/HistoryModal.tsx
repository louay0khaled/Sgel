import React from 'react';
import Modal from './Modal';
import type { AllLogs } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allLogs: AllLogs;
  onSelectDate: (date: string) => void;
  currentDate: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, allLogs, onSelectDate, currentDate }) => {
  const sortedDates = Object.keys(allLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDate = (dateString: string) => {
     const date = new Date(dateString + 'T00:00:00'); // Use specific time to avoid timezone issues
     const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
     const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

     const dayName = new Intl.DateTimeFormat('ar-EG', dayOptions).format(date);
     const fullDate = new Intl.DateTimeFormat('ar-EG', dateOptions).format(date);

     return `${fullDate} (${dayName})`;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="سجل التواريخ">
      <div className="max-h-96 overflow-y-auto">
        {sortedDates.length > 0 ? (
            <ul className="space-y-2">
            {sortedDates.map((date) => (
              <li key={date}>
                <button
                  onClick={() => onSelectDate(date)}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors text-lg ${
                    date === currentDate
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'bg-gray-100 hover:bg-indigo-100 text-gray-800'
                  }`}
                >
                  {formatDate(date)}
                </button>
              </li>
            ))}
          </ul>
        ) : (
            <p className="text-center text-gray-500 py-8">لا توجد سجلات محفوظة.</p>
        )}
      </div>
    </Modal>
  );
};

export default HistoryModal;
