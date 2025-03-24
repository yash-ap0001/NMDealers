import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RichTextEditor from '../RichTextEditor';
import { vi } from 'vitest';

// Mock @tiptap/starter-kit
vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: () => ({
      bold: true,
      italic: true,
      bulletList: true,
      orderedList: true,
    }),
  },
}));

// Mock @tiptap/react
vi.mock('@tiptap/react', () => ({
  EditorContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="editor-content">{children}</div>
  ),
  useEditor: () => ({
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({
          run: vi.fn(),
        }),
        toggleItalic: () => ({
          run: vi.fn(),
        }),
        toggleBulletList: () => ({
          run: vi.fn(),
        }),
        toggleOrderedList: () => ({
          run: vi.fn(),
        }),
      }),
    }),
    isActive: vi.fn().mockReturnValue(false),
    on: vi.fn(),
    off: vi.fn(),
    getHTML: vi.fn().mockReturnValue('<p>Test content</p>'),
    setContent: vi.fn(),
  }),
}));

describe('RichTextEditor', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial value', () => {
    render(<RichTextEditor value="<p>Test content</p>" onChange={mockOnChange} />);
    expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('shows toolbar with formatting options', () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />);
    
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Numbered List')).toBeInTheDocument();
  });

  it('applies error styles when error prop is true', () => {
    render(<RichTextEditor value="" onChange={mockOnChange} error={true} />);
    expect(screen.getByTestId('rich-text-editor')).toHaveClass('border-red-500');
  });
}); 