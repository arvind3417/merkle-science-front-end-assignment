// src/components/Calendar.tsx
import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
  subMonths,
  addMonths,
  subYears,
  addYears,
  setYear,
} from "date-fns";
import { useTheme } from "../ThemeContext";
import "../styles.css";
import axios from "axios";
import CountrySelector from "./CountrySelector";

interface Holiday {
  date: string;
  name: string;
}

interface CountryOption {
  value: string;
  label: string;
}

interface CalendarProps {
  onHolidayClick: (date: string) => void;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

const Calendar: React.FC<CalendarProps> = ({
  onHolidayClick,
  location,
  setLocation,
}) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [showCountrySelector, setShowCountrySelector] =
    useState<boolean>(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data.map((country: any) => ({
          value: country.cca2,
          label: country.name.common,
        }));
        setCountryOptions(countries);
      } catch (error) {
        console.error("Error fetching country options:", error);
      }
    };

    fetchCountryOptions();
  }, []);

  useEffect(() => {
    const fetchHolidays = async () => {
      if (location) {
        const currentYear = format(currentDate, "yyyy");
        const apiKey = "zlAHHyLuz5F5a40Za6gpJg==GpUfYDh81g3qWhLE";

        try {
          const response = await axios.get(
            `https://api.api-ninjas.com/v1/holidays?country=${location}&year=${currentYear}`,
            {
              headers: {
                "X-Api-Key": apiKey,
              },
            }
          );

          setHolidays(response.data);
        } catch (error) {
          console.error("Error fetching holidays:", error);
        }
      }
    };

    fetchHolidays();
  }, [location, currentDate]);

  const handleLocationChange = (
    selectedOption: string | CountryOption | null
  ) => {
    if (selectedOption) {
      setLocation(
        typeof selectedOption === "string"
          ? selectedOption
          : selectedOption.value
      );
    } else {
      setLocation("");
    }
    setShowCountrySelector(false);
  };

  const [view, setView] = React.useState<"month" | "year">("month");
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startOfWeekDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
  const [selectedYear, setSelectedYear] = useState<number>(
    parseInt(format(currentDate, "yyyy"), 10)
  );

  // Function to handle year change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearValue = parseInt(event.target.value, 10);
    setSelectedYear(selectedYearValue);

    // Set the new year for the current date
    setCurrentDate(setYear(currentDate, selectedYearValue));
  };
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
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }

    // Update the selectedYear state
    setSelectedYear(parseInt(format(currentDate, "yyyy"), 10));
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }

    // Update the selectedYear state
    setSelectedYear(parseInt(format(currentDate, "yyyy"), 10));
  };

  const handleViewChange = (newView: "month" | "year") => {
    setView(newView);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());

    // Update the selectedYear state
    setSelectedYear(parseInt(format(new Date(), "yyyy"), 10));
  };

  const handleLocationClick = () => {
    // Implement your logic to open a location selection dialog or any other action
    console.log("Location clicked!");
  };

  const toggleCountrySelector = () => {
    setShowCountrySelector((prev) => !prev);
  };

  return (
    <div className={`calendar-container ${theme} p-4 md:p-8 lg:p-12 rounded-md shadow-md`}>
      <div className="calendar-controls flex flex-row md:flex-row items-start justify-center mb-4 bg-blue-800 text-white p-4 rounded-md">
        <div className="controls-left flex space-x-2 mb-4 md:mb-0">
          <button
            onClick={handlePrev}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-10 transition duration-300"
          >
            &lsaquo;
          </button>
          <button
            onClick={handleNext}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-10 transition duration-300"
          >
            &rsaquo;
          </button>
          <button
            onClick={handleGoToToday}
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-20 transition duration-300"
          >
            Today
          </button>
        </div>

        <div
          className="location-selector cursor-pointer flex items-center mx-2 mb-4 md:mb-0"
          onClick={toggleCountrySelector}
        >
          <span role="img" aria-label="location-icon" className="mr-2">
            🌍
          </span>
          {location ? (
            <span className="country-name text-white-600">
              {
                countryOptions.find((country) => country.value === location)
                  ?.label
              }
            </span>
          ) : (
            <span className="text-white-600">Select Country</span>
          )}
        </div>

        <CountrySelector
          isOpen={showCountrySelector}
          options={countryOptions}
          selectedValue={location}
          onClose={() => setShowCountrySelector(false)}
          onSelect={handleLocationChange}
        />

        <div
          className="controls-center cursor-pointer flex-grow text-center mb-4 md:mb-0"
          onClick={handleLocationClick}
        >
          <span className="text-xl font-bold">
            {view === "month"
              ? format(currentDate, "MMMM yyyy")
              : format(currentDate, "MMMM yyyy")}
          </span>
        </div>

        <div className="controls-right flex space-x-2 relative inline-block text-left">
          <button
            onClick={() => handleViewChange("year")}
            className={`text-white px-4 py-2 rounded ${
              view === "year" ? "bg-blue-300 " : "bg-blue-500 hover:bg-blue-600"
            } transition duration-300`}
          >
            Year
          </button>
          <button
            onClick={() => handleViewChange("month")}
            className={`text-white px-4 py-2 rounded ${
              view === "month"
                ? "bg-blue-300 "
                : "bg-blue-500 hover:bg-blue-600"
            } transition duration-300`}
          >
            Month
          </button>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 transition duration-300"
          >
            {/* Generate a list of years */}
            {Array.from(
              { length: 10 },
              (_, index) => selectedYear - 5 + index
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

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
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="calendar-row">
              {week.map((currentDay, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`calendar-cell ${
                    isToday(currentDay as Date) ? "today" : "text-gray-800"
                  } border p-8 text-2xl relative ${
                    currentDay
                      ? isToday(currentDay as Date)
                        ? "bg-blue-600" // Adjusted background color for today's date
                        : "bg-blue-200" // Adjusted background color for other dates
                      : "bg-gray-300" // Adjusted background color for empty cells
                  }`}
                  onClick={() =>
                    currentDay &&
                    onHolidayClick(
                      currentDay ? format(currentDay as Date, "yyyy-MM-dd") : ""
                    )
                  }
                >
                  <div className="date">
                    {currentDay && (
                      <span className="day-number text-3xl font-bold">
                        {format(currentDay as Date, "d")}
                      </span>
                    )}
                  </div>
                  {currentDay && (
                    <div className="holidays absolute top-0 right-0 mt-1 mr-1">
                      {holidays
                        .filter(
                          (holiday) =>
                            format(new Date(holiday.date), "yyyy-MM-dd") ===
                            format(currentDay as Date, "yyyy-MM-dd")
                        )
                        .map((holiday) => (
                          <div
                            key={holiday.date}
                            className="holiday-block bg-blue-500 text-white rounded p-0.5 text-xs"
                          >
                            <div className="holiday-name">{holiday.name}</div>
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
    </div>
  );
};

export default Calendar;
