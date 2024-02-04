import React from "react";
import CountrySelector from "./CountrySelector";
import "../App.css";
import {
    format
  } from "date-fns";
interface CalendarControlsProps {
  handlePrev: () => void;
  handleNext: () => void;
  handleGoToToday: () => void;
  toggleCountrySelector: () => void;
  showCountrySelector: boolean;
  location: string;
  countryOptions: any[];
  handleLocationChange: (selectedOption: string | null | any) => void;
  view: "month" | "year";
  currentDate: Date;
  handleYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedYear: number;
  handleViewChange: (newView: "month" | "year") => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  handlePrev,
  handleNext,
  handleGoToToday,
  toggleCountrySelector,
  showCountrySelector,
  location,
  countryOptions,
  handleLocationChange,
  view,
  currentDate,
  handleYearChange,
  selectedYear,
  handleViewChange,
}) => {
  return (
    <div className="calendar-controls flex flex-col items-center md:flex-row justify-between mb-4 bg-blue-800 text-white p-4 rounded-md">
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
          className="text-white bg-blue-500 hover:bg-blue-400  px-4 py-2 rounded w-20 "
        >
          Today
        </button>
      </div>

      <CountrySelector
        isOpen={showCountrySelector}
        options={countryOptions}
        selectedValue={location}
        onClose={() => toggleCountrySelector()}
        onSelect={handleLocationChange}
      />

      <div className="flex gap-x-4 items-center">
        <div
          className="location-selector cursor-pointer flex items-center mx-2 mb-4 md:mb-0 bg-white text-blue-500 font-bold py-2 px-4 rounded-lg"
          onClick={toggleCountrySelector}
        >
          <span role="img" aria-label="location-icon" className="gap-x-2">
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
        <div className="controls-center flex-grow text-center mb-4 md:mb-0">
          <span className="text-xl font-bold">
            {view === "month"
              ? format(currentDate, "MMMM yyyy")
              : format(currentDate, "MMMM yyyy")}
          </span>
        </div>
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
          {Array.from(
            { length: 81 },
            (_, index) => 1950 + index
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalendarControls;
