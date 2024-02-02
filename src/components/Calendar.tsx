// src/components/Calendar.tsx
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, subMonths, addMonths, subYears, addYears } from 'date-fns';
import { useTheme } from '../ThemeContext';
import '../styles.css';

interface CalendarProps {
  holidays: { date: string; name: string }[];
  onHolidayClick: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ holidays, onHolidayClick }) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'month' | 'year'>('month');

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startOfWeekDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startOfWeekDate;

  while (day <= endOfWeekDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  days.forEach((currentDay) => {
    if (isSameMonth(currentDay, currentDate)) {
      week.push(currentDay);
    } else {
      week.push(null);
    }

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }
  };

  const handleViewChange = (newView: 'month' | 'year') => {
    setView(newView);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className={`calendar-container ${theme}`}>
      <div className="calendar-controls">
        <div className="controls-left">
          <button onClick={handlePrev}>&lsaquo;</button>
          <button onClick={handleNext}>&rsaquo;</button>
          <button onClick={handleGoToToday}>Today</button>
        </div>
        <div className="controls-center">
          <span>{view === 'month' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'MMMM yyyy')}</span>
        </div>
        <div className="controls-right">
          <button onClick={() => handleViewChange('year')} className={view === 'year' ? 'bg-red-800' : ''}>
            Year
          </button>
          <button onClick={() => handleViewChange('month')} className={view === 'month' ? 'bg-red-800' : ''}>
            Month
          </button>
        </div>
      </div>
      <table className="calendar-table">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <th key={index} className="calendar-header">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="calendar-row">
              {week.map((currentDay, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`calendar-cell ${isToday(currentDay as Date) ? 'today' : ''}`}
                  onClick={() => currentDay && onHolidayClick(currentDay ? format(currentDay as Date, 'yyyy-MM-dd') : '')}
                >
                  <div className="date">{currentDay && <span className="day-number">{format(currentDay as Date, 'd')}</span>}</div>
                  <div className="holidays">
                    {currentDay &&
                      holidays
                        .filter((holiday) => format(new Date(holiday.date), 'yyyy-MM-dd') === format(currentDay as Date, 'yyyy-MM-dd'))
                        .map((holiday) => (
                          <div key={holiday.date} className="holiday-name">
                            {holiday.name}
                          </div>
                        ))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
