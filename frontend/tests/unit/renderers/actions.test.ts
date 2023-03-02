import React from "react";
import {render, screen, fireEvent} from '@testing-library/react';
import { vi } from 'vitest';
import dayjs from "dayjs";
import Commit from '../../../src/renderers/actions/Commit';


describe("Commit", () => {

  it('renders correctly', () => {
    const mockOnClick = vi.fn();
    const mockTimestamp = new Date().getTime();
    const mockHash = 'abc123';

    const { getByRole, getByText  } = render(<Commit onlick={mockOnClick} timestamp={mockTimestamp} hash={mockHash} />);

    expect(getByText('abc123')).toBeInTheDocument();
    expect(getByText('a few seconds ago')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const mockOnClick = vi.fn();
    const mockTimestamp = new Date().getTime();
    const mockHash = 'abc123';

    const { getByText } = render(<Commit> onClick={mockOnClick} timestamp={mockTimestamp} hash={mockHash} />);

    fireEvent.click(getByText('abc123'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
