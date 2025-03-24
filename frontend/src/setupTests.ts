import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.URL.createObjectURL
window.URL.createObjectURL = vi.fn();

// Mock window.URL.revokeObjectURL
window.URL.revokeObjectURL = vi.fn();

// Mock getClientRects and getBoundingClientRect
Element.prototype.getClientRects = function() {
  const rect = new DOMRect(0, 0, 100, 100);
  const rects = [rect] as DOMRect[] & { item(index: number): DOMRect | null };
  rects.item = (index: number) => rects[index] || null;
  return rects as unknown as DOMRectList;
};

Element.prototype.getBoundingClientRect = function() {
  return new DOMRect(0, 0, 100, 100);
};

// Mock elementFromPoint and elementsFromPoint
document.elementFromPoint = vi.fn().mockReturnValue(null);
document.elementsFromPoint = vi.fn().mockReturnValue([]);

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock selection and range
const mockRange = {
  setStart: vi.fn(),
  setEnd: vi.fn(),
  getBoundingClientRect: () => new DOMRect(0, 0, 100, 100),
  getClientRects: () => [],
  commonAncestorContainer: document,
};

const mockSelection = {
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
  getRangeAt: vi.fn().mockReturnValue(mockRange),
  rangeCount: 1,
};

window.getSelection = vi.fn().mockReturnValue(mockSelection);
document.createRange = vi.fn().mockReturnValue(mockRange);

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 