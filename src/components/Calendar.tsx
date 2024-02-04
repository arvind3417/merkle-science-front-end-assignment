import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  subMonths,
  addMonths,
  subYears,
  addYears,
  setYear,
} from "date-fns";
import axios from "axios";
import { useTheme } from "../ThemeContext";
import "../styles.css";
import CalendarControls from "./CalendarControls";
import CalendarTable from "./CalendarTable";

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
        const apiKey = "s55mrpg4Mvohn2DFvz8CVpU3tjtOMTyBhsUadq4Y";

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

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearValue = parseInt(event.target.value, 10);
    setSelectedYear(selectedYearValue);

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

    setSelectedYear(parseInt(format(currentDate, "yyyy"), 10));
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }
    setSelectedYear(parseInt(format(currentDate, "yyyy"), 10));
  };

  const handleViewChange = (newView: "month" | "year") => {
    setView(newView);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
    setSelectedYear(parseInt(format(new Date(), "yyyy"), 10));
  };

  const toggleCountrySelector = () => {
    setShowCountrySelector((prev) => !prev);
  };

  return (
    <div className={`calendar-container p-4 md:p-8 lg:p-12 rounded-md shadow-md`}>
      <CalendarControls
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleGoToToday={handleGoToToday}
        toggleCountrySelector={toggleCountrySelector}
        showCountrySelector={showCountrySelector}
        location={location}
        countryOptions={countryOptions}
        handleLocationChange={handleLocationChange}
        view={view}
        currentDate={currentDate}
        handleYearChange={handleYearChange}
        selectedYear={selectedYear}
        handleViewChange={handleViewChange}
      />
      <CalendarTable
        weeks={weeks}
        currentDate={currentDate}
        onHolidayClick={onHolidayClick}
        holidays={holidays}
      />
    </div>
  );
};

export default Calendar;
