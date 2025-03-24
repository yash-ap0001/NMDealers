import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import VehicleForm from '../VehicleForm';
import { vi } from 'vitest';
import axios from 'axios';

// Mock modules
vi.mock('axios');
vi.mock('../../common/RichTextEditor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid="mock-rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }),
  };
});

const mockNavigate = vi.fn();
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VehicleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderVehicleForm = () => {
    return render(
      <BrowserRouter>
        <VehicleForm />
      </BrowserRouter>
    );
  };

  it('renders the form with all required fields', async () => {
    await act(async () => {
      renderVehicleForm();
    });

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-rich-text-editor')).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fuel type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transmission/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/condition/i)).toBeInTheDocument();
  });

  it('shows preview modal when preview button is clicked', async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderVehicleForm();
    });
    
    const previewButton = screen.getByText(/preview/i);
    await act(async () => {
      await user.click(previewButton);
    });

    expect(screen.getByText(/preview vehicle listing/i)).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderVehicleForm();
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-upload') as HTMLInputElement;

    await act(async () => {
      await user.upload(input, file);
    });

    expect(input.files?.[0]).toBe(file);
  });
}); 