import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarControls from '../components/CalendarControls';

const mockHandlePrev = jest.fn();
const mockHandleNext = jest.fn();
const mockHandleGoToToday = jest.fn();
const mockToggleCountrySelector = jest.fn();
const mockHandleLocationChange = jest.fn();
const mockHandleYearChange = jest.fn();
const mockHandleViewChange = jest.fn();

const mockCountryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

const mockView = 'month';
const mockCurrentDate = new Date();
const mockSelectedYear = 2022;
const mockLocation = 'us';
const mockShowCountrySelector = true;

describe('CalendarControls Component', () => {
  it('renders CalendarControls component', () => {
    render(
      <CalendarControls
        handlePrev={mockHandlePrev}
        handleNext={mockHandleNext}
        handleGoToToday={mockHandleGoToToday}
        toggleCountrySelector={mockToggleCountrySelector}
        showCountrySelector={mockShowCountrySelector}
        location={mockLocation}
        countryOptions={mockCountryOptions}
        handleLocationChange={mockHandleLocationChange}
        view={mockView}
        currentDate={mockCurrentDate}
        handleYearChange={mockHandleYearChange}
        selectedYear={mockSelectedYear}
        handleViewChange={mockHandleViewChange}
      />
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
  });

  it('handles button clicks', () => {
    render(
      <CalendarControls
        handlePrev={mockHandlePrev}
        handleNext={mockHandleNext}
        handleGoToToday={mockHandleGoToToday}
        toggleCountrySelector={mockToggleCountrySelector}
        showCountrySelector={mockShowCountrySelector}
        location={mockLocation}
        countryOptions={mockCountryOptions}
        handleLocationChange={mockHandleLocationChange}
        view={mockView}
        currentDate={mockCurrentDate}
        handleYearChange={mockHandleYearChange}
        selectedYear={mockSelectedYear}
        handleViewChange={mockHandleViewChange}
      />
    );

    fireEvent.click(screen.getByText('Today'));
    expect(mockHandleGoToToday).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Year'));
    expect(mockHandleViewChange).toHaveBeenCalledWith('year');

    fireEvent.click(screen.getByText('Month'));
    expect(mockHandleViewChange).toHaveBeenCalledWith('month');
  });

});
