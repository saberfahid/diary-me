import React, { useEffect, useState } from 'react';
import { getDiaryEntriesByDate } from '../db';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [entries, setEntries] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const now = new Date();
    const daysArr = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) })
      .map(d => format(d, 'yyyy-MM-dd'));
    setDays(daysArr);
  }, []);

  useEffect(() => {
    getDiaryEntriesByDate(selectedDate).then(setEntries);
  }, [selectedDate]);

  return (
    <div className="backdrop-blur-lg bg-white/80 rounded-2xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Calendar View</h2>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map(day => (
          <button
            key={day}
            className={`p-2 rounded-full font-semibold shadow transition-all duration-200 ${selectedDate === day ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white scale-110' : 'bg-gray-100 text-gray-700 hover:bg-blue-200'}`}
            onClick={() => setSelectedDate(day)}
          >
            {day.slice(-2)}
          </button>
        ))}
      </div>
      <ul>
        {entries.map(entry => (
          <li key={entry.id} className="mb-4 border-b pb-2 last:border-b-0 last:pb-0">
            <span className="text-3xl mr-2 drop-shadow">{entry.mood}</span>
            <span className="font-bold text-xl text-blue-700">{entry.title}</span>
            <span className="ml-2 text-gray-500">{entry.date}</span>
            {entry.tags && entry.tags.length > 0 && (
              <span className="ml-2 text-xs bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-2 py-1 rounded-full text-gray-700">{entry.tags.join(', ')}</span>
            )}
            {entry.image && <img src={entry.image} alt="Diary" className="my-2 max-h-40 rounded-xl shadow" />}
            <div className="prose max-w-none bg-white/60 p-3 rounded-lg border border-gray-200" dangerouslySetInnerHTML={{ __html: entry.content }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarView;
