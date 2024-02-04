import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarTable from '../components/CalendarTable';

const mockOnHolidayClick = jest.fn();

const mockWeeks = [
  [new Date(2022, 1, 1), new Date(2022, 1, 2), new Date(2022, 1, 3), null, null, null, null],
  [new Date(2022, 1, 4), new Date(2022, 1, 5), new Date(2022, 1, 6), null, null, null, null],
];

const mockCurrentDate = new Date(2022, 1, 1);

const mockHolidays = [
  { date: '2022-02-01', name: 'Holiday 1' },
  { date: '2022-02-05', name: 'Holiday 2' },
];

describe('CalendarTable', () => {
  test('renders table headers', () => {
    render(
      <CalendarTable
        weeks={mockWeeks}
        currentDate={mockCurrentDate}
        onHolidayClick={mockOnHolidayClick}
        holidays={mockHolidays}
      />
    );

    const tableHeaders = screen.getAllByRole('columnheader');
    expect(tableHeaders).toHaveLength(7);
  });

  test('renders correct number of cells', () => {
    render(
      <CalendarTable
        weeks={mockWeeks}
        currentDate={mockCurrentDate}
        onHolidayClick={mockOnHolidayClick}
        holidays={mockHolidays}
      />
    );

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(mockWeeks.flat().length);
  });

  test('clicking on a cell calls onHolidayClick with correct date', () => {
    render(
      <CalendarTable
        weeks={mockWeeks}
        currentDate={mockCurrentDate}
        onHolidayClick={mockOnHolidayClick}
        holidays={mockHolidays}
      />
    );

    const cell = screen.getByText('1');
    fireEvent.click(cell);

    expect(mockOnHolidayClick).toHaveBeenCalledWith('2022-02-01');
  });
});
