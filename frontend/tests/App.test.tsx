import App from '../src/App';
import { render, screen } from './setup';
import ResizeObserver from 'resize-observer-polyfill';

describe('App', () => {
  window.ResizeObserver = ResizeObserver;
  it('renders headline', async () => {
    render(<App />);
    // check if App components renders headline
    expect(await screen.findByText(/momenTUM Study Designer/i)).toBeInTheDocument();
  });
});