import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Import individual matchers to avoid the issue with matchers being undefined
import { 
  toBeInTheDocument, 
  toHaveTextContent,
  toHaveAttribute,
  toHaveAccessibleDescription,
  toHaveAccessibleName,
  toHaveClass,
  toHaveStyle,
  toBeVisible,
  toBeDisabled,
  toBeEnabled,
  toBeChecked,
  toHaveValue
} from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend({ 
  toBeInTheDocument,
  toHaveTextContent,
  toHaveAttribute,
  toHaveAccessibleDescription,
  toHaveAccessibleName,
  toHaveClass,
  toHaveStyle,
  toBeVisible,
  toBeDisabled,
  toBeEnabled,
  toBeChecked,
  toHaveValue
});

// Clear all mocks after each test
afterEach(() => {
  cleanup();
}); 