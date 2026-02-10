import { renderHook, act } from '@testing-library/react';
import useThemeColors from '@/src/hooks/useThemeColors';

// Mock getComputedStyle
const mockGetComputedStyle = jest.fn();
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

describe('useThemeColors', () => {
  let toDisconnect;

  beforeEach(() => {
    // Default mock implementation
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn((prop) => {
        if (prop === '--accent-1') return '#ff0000'; // Default Accent
        if (prop === '--text') return '#000000';     // Default Text
        if (prop === '--muted') return '#cccccc';    // Default Muted
        if (prop === '--bg') return '#ffffff';       // Default Bg
        return '';
      }),
    });

    // Mock MutationObserver
    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe(target, options) {
        // expose callback for manual triggering
        this.callback([{ type: 'attributes', attributeName: 'class' }]);
      }
      disconnect() {
        if (toDisconnect) toDisconnect();
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial theme colors correctly', () => {
    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toEqual({
      accent1: '#ff0000',
      text: '#000000',
      muted: '#cccccc',
      bg: '#ffffff',
    });
  });

  it('should update colors when observer triggers', async () => {
    let observerCallback;
    
    // Custom mock for this test to capture callback
    global.MutationObserver = class {
      constructor(callback) {
        observerCallback = callback;
      }
      observe() {}
      disconnect() {}
    };

    const { result } = renderHook(() => useThemeColors());

    // Verify initial
    expect(result.current.accent1).toBe('#ff0000');

    // Change mock values for update
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn((prop) => {
        if (prop === '--accent-1') return '#00ff00'; // New Accent
        if (prop === '--text') return '#ffffff';
        if (prop === '--muted') return '#888888';
        if (prop === '--bg') return '#000000';
        return '';
      }),
    });

    // Trigger observer
    await act(async () => {
      observerCallback([{ type: 'attributes', attributeName: 'class' }]);
    });

    expect(result.current.accent1).toBe('#00ff00');
    expect(result.current.bg).toBe('#000000');
  });

  it('should handle missing CSS variables gracefully with defaults', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn(() => ''), // Empty strings
    });

    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toEqual({
      accent1: '#e74c3c', // Fallback
      text: '#ffffff',    // Fallback
      muted: '#888888',   // Fallback
      bg: '#1a1a1a',      // Fallback
    });
  });
});
