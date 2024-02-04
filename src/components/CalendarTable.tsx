import React from "react";
import {
    format,
    isToday,
  } from "date-fns";
interface CalendarTableProps {
  weeks: (Date | null)[][];
  currentDate: Date;
  onHolidayClick: (date: string) => void;
  holidays: any[];
}

const CalendarTable: React.FC<CalendarTableProps> = ({
  weeks,
  currentDate,
  onHolidayClick,
  holidays,
}) => {
  return (
    <table className="calendar-table w-full">
      <thead>
        <tr>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <th
                key={index}
                className="calendar-header text-lg font-bold text-gray-800 border p-3 bg-gray-100"
              >
                {day}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="">
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex} className="calendar-row">
            {week.map((currentDay, dayIndex) => (
              <td
                key={dayIndex}
                className={`calendar-cell text-center pb-4 ${
                  isToday(currentDay as Date) ? "today" : "text-gray-800"
                } border text-2xl ${
                  currentDay
                    ? isToday(currentDay as Date)
                      ? "bg-blue-800 text-blue-100"
                      : "bg-blue-200"
                    : "bg-gray-200"
                }`}
                style={{ maxWidth: "100px", width: "100px" }}
                onClick={() =>
                  currentDay &&
                  onHolidayClick(
                    currentDay
                      ? format(currentDay as Date, "yyyy-MM-dd")
                      : ""
                  )
                }
              >
                <div className="date p-4 pb-0">
                  {currentDay && (
                    <span className="day-number text-xs sm:text-base md:text-lg lg:text-xl font-bold">
                      {format(currentDay as Date, "d")}
                    </span>
                  )}
                </div>
                {currentDay && (
                  <div className="holidays">
                    {holidays
                      .filter(
                        (holiday) =>
                          format(new Date(holiday.date), "yyyy-MM-dd") ===
                          format(currentDay as Date, "yyyy-MM-dd")
                      )
                      .map((holiday) => (
                        <div
                          key={holiday.date}
                          className="holiday-block w-full
                           h-fit text-center bg-blue-500 text-white rounded text-[8px] p-0.5 leading-3 sm:text-xs"
                        >
                          <div className="holiday-name w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">{holiday.name}</div>
                        </div>
                      ))}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarTable;
