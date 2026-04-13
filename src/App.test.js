import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with unit filter buttons', () => {
  render(<App />);
  // Check if "All" button exists (this is always present)
  const allButton = screen.getAllByText('All')[0];
  expect(allButton).toBeInTheDocument();
});
