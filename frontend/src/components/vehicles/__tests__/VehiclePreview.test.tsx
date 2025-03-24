import React from 'react';
import { render, screen } from '@testing-library/react';
import VehiclePreview from '../VehiclePreview';
import { vi } from 'vitest';

describe('VehiclePreview', () => {
  const mockData = {
    title: 'Test Vehicle',
    make: 'Test Make',
    model: 'Test Model',
    year: 2023,
    price: 25000,
    description: '<p>Test Description</p>',
    mileage: 50000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyStyle: 'SUV',
    color: 'Black',
    condition: 'Used',
    images: [],
  };

  const mockImages = [
    'http://example.com/image1.jpg',
    'http://example.com/image2.jpg',
  ];

  it('renders vehicle details correctly', () => {
    render(<VehiclePreview data={mockData} images={mockImages} />);

    expect(screen.getByText(mockData.title)).toBeInTheDocument();
    expect(screen.getByText(mockData.make)).toBeInTheDocument();
    expect(screen.getByText(mockData.model)).toBeInTheDocument();
    expect(screen.getByText(mockData.year.toString())).toBeInTheDocument();
    expect(screen.getByText(/25,000/)).toBeInTheDocument();
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
    expect(screen.getByText(mockData.fuelType)).toBeInTheDocument();
    expect(screen.getByText(mockData.transmission)).toBeInTheDocument();
    expect(screen.getByText(mockData.bodyStyle)).toBeInTheDocument();
    expect(screen.getByText(mockData.color)).toBeInTheDocument();
    expect(screen.getByText(mockData.condition)).toBeInTheDocument();
  });

  it('renders images correctly', () => {
    render(<VehiclePreview data={mockData} images={mockImages} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockImages.length);
    mockImages.forEach((image, index) => {
      expect(images[index]).toHaveAttribute('src', image);
      expect(images[index]).toHaveAttribute('alt', `${mockData.title} - Image ${index + 1}`);
    });
  });

  it('renders HTML description correctly', () => {
    render(<VehiclePreview data={mockData} images={mockImages} />);

    const description = screen.getByTestId('vehicle-description');
    expect(description.innerHTML).toBe(mockData.description);
  });

  it('handles missing images gracefully', () => {
    render(<VehiclePreview data={mockData} images={[]} />);

    const noImagesMessage = screen.getByText('No images');
    expect(noImagesMessage).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    const dataWithHighPrice = {
      ...mockData,
      price: 1000000,
    };

    render(<VehiclePreview data={dataWithHighPrice} images={mockImages} />);

    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
  });
}); 