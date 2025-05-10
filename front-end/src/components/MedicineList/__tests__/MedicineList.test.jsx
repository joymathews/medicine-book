import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase BEFORE importing the component
vi.mock('../../../configurations/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('fake-token')
    }
  },
  signOut: vi.fn()
}));

// Import component after mocking dependencies
import MedicineList from '../MedicineList';

// Mock fetch
global.fetch = vi.fn();

describe('MedicineList Component', () => {
  const mockUser = { getIdToken: () => Promise.resolve('fake-token') };
  
  beforeEach(() => {
    fetch.mockReset();
    vi.clearAllMocks();
  });

  it('renders medicine data correctly from API response', async () => {
    // Mock API response with custom times
    const mockResponse = {
      success: true,
      data: [
        {
          id: "nsS8G2Qnzezf8SrSsUUo",
          medicineName: "Medicine 1",
          doctor: "Puthoran",
          purpose: "test",
          prescriptionDate: "2025-05-07",
          duration: {
            value: "14",
            type: "DAYS"
          },
          recurrence: {
            pattern: "DAILY",
            interval: null,
            specificDays: null,
            specificDates: null
          },
          dosage: {
            morning: {
              enabled: false,
              foodRelation: null
            },
            noon: {
              enabled: false,
              foodRelation: null
            },
            night: {
              enabled: false,
              foodRelation: null
            },
            customTimes: [
              {
                id: "time_1746587910549_ne0k5qcpu",
                time: "11:51",
                foodRelation: "AFTER"
              }
            ]
          },
          notes: "",
          userId: "GlhK1GOHeY1i3Fm1ol4bB5Ktsfey",
          createdAt: "2025-05-07T03:18:36.604Z"
        }
      ]
    };

    // Mock the fetch call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    // Render the component within a router context
    render(
      <BrowserRouter>
        <MedicineList user={mockUser} />
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText('Loading medicines...')).toBeInTheDocument();

    // Wait for API data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Medicine 1')).toBeInTheDocument();
      expect(screen.getByText('Puthoran')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('14 day(s)')).toBeInTheDocument();
      expect(screen.getByText('11:51 (After Food)')).toBeInTheDocument();
    });
  });
});