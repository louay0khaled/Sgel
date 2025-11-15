import React, { useState, useEffect, useMemo } from 'react';
import LogTable from './components/LogTable';
import HistoryModal from './components/HistoryModal';
import Logo from './components/Logo';
import type { LogEntry, AllLogs } from './types';

const INITIAL_ROWS = 15; // Adjusted for mobile screens

const getTodayDateString = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format

const createEmptyEntry = (id: number): LogEntry => ({
  id,
  name: '',
  entryTime: null,
  exitTime: null,
  capacity: '',
  vehicleType: '',
  notes: '',
});

const App: React.FC = () => {
  const [allLogs, setAllLogs] = useState<AllLogs>(() => {
    try {
      const savedData = localStorage.getItem('allLogs');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Basic validation for new format
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return parsed;
        }
      }
      // Check for old format and migrate
      const oldSavedEntries = localStorage.getItem('logEntries');
      if(oldSavedEntries) {
          const oldParsed = JSON.parse(oldSavedEntries);
          if(Array.isArray(oldParsed)) {
              localStorage.removeItem('logEntries'); // clean up old key
              const today = getTodayDateString();
              return { [today]: oldParsed };
          }
      }
    } catch (error) {
      console.error("Could not parse logs from localStorage", error);
    }
    return {};
  });

  const [currentLogDate, setCurrentLogDate] = useState(getTodayDateString());
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Initialize today's log if it doesn't exist
  useEffect(() => {
    const today = getTodayDateString();
    setAllLogs(prevLogs => {
      if (!prevLogs[today] || prevLogs[today].length === 0) {
        return {
          ...prevLogs,
          [today]: Array.from({ length: INITIAL_ROWS }, (_, i) => createEmptyEntry(Date.now() + i)),
        };
      }
      return prevLogs;
    });
  }, []);

  useEffect(() => {
    // A null check to prevent saving an empty object on first load before initialization
    if (Object.keys(allLogs).length > 0) {
      localStorage.setItem('allLogs', JSON.stringify(allLogs));
    }
  }, [allLogs]);

  const { currentDateDisplay, currentDayDisplay } = useMemo(() => {
    const date = new Date(currentLogDate + 'T00:00:00'); // Ensure correct date parsing in local time
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${day} / ${month} / ${year}`;
    const formattedDay = new Intl.DateTimeFormat('ar-EG', dayOptions).format(date);
    return { currentDateDisplay: formattedDate, currentDayDisplay: formattedDay };
  }, [currentLogDate]);


  const handleCellChange = (id: number, field: 'name' | 'capacity' | 'vehicleType' | 'notes', value: string) => {
    const today = getTodayDateString();
    if (today !== currentLogDate) {
      setCurrentLogDate(today);
    }

    setAllLogs(prevLogs => {
      const dateKeyToUpdate = today;
      const currentEntries = prevLogs[dateKeyToUpdate] || Array.from({ length: INITIAL_ROWS }, (_, i) => createEmptyEntry(Date.now() + i));
      
      const updatedEntries = currentEntries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      );

      // Auto-add new row if name is typed in the last row
      const lastEntry = currentEntries[currentEntries.length - 1];
      if (field === 'name' && lastEntry && id === lastEntry.id && value.trim() !== '' && lastEntry.name.trim() === '') {
          updatedEntries.push(createEmptyEntry(Date.now()));
      }

      return { ...prevLogs, [dateKeyToUpdate]: updatedEntries };
    });
  };

  const handleTimeLog = (id: number, type: 'entry' | 'exit') => {
    const today = getTodayDateString();
    if (today !== currentLogDate) {
      setCurrentLogDate(today);
    }

    setAllLogs(prevLogs => {
      const dateKeyToUpdate = today;
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      const currentEntries = prevLogs[dateKeyToUpdate] || Array.from({ length: INITIAL_ROWS }, (_, i) => createEmptyEntry(Date.now() + i));
      
      const updatedEntries = currentEntries.map(entry => {
        if (entry.id === id) {
          if (type === 'entry' && !entry.entryTime && entry.name.trim()) {
            return { ...entry, entryTime: now };
          }
          if (type === 'exit' && entry.entryTime && !entry.exitTime) {
            return { ...entry, exitTime: now };
          }
        }
        return entry;
      });
      return { ...prevLogs, [dateKeyToUpdate]: updatedEntries };
    });
  };

  const handleSelectDate = (date: string) => {
    setCurrentLogDate(date);
    setIsHistoryModalOpen(false);
  };
  
  const logEntriesForCurrentDate = allLogs[currentLogDate] || [];

  return (
    <>
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Logo />
          <header className="mb-4 flex justify-between items-center text-xl p-2 font-bold">
            <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="text-left p-2 rounded-lg transition-colors hover:bg-gray-100"
                aria-label="عرض سجل التواريخ"
            >
                <span className="font-normal">التاريخ:</span> {currentDateDisplay}
            </button>
             <div className="text-right">
              <span className="font-normal">اليوم:</span> {currentDayDisplay}
            </div>
          </header>

          <main>
            <LogTable 
              entries={logEntriesForCurrentDate} 
              onCellChange={handleCellChange}
              onTimeLog={handleTimeLog}
            />
          </main>
        </div>
      </div>
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        allLogs={allLogs}
        onSelectDate={handleSelectDate}
        currentDate={currentLogDate}
      />
    </>
  );
};

export default App;