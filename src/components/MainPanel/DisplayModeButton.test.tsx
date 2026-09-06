import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DisplayModeButton from './DisplayModeButton';
import type { DisplayMode } from '../../stores/settingsStore';

// Each call mounts its own button and unmounts it again, so several calls in
// one test never leave more than one button in the document.
const click = (value: DisplayMode) => {
  const onChange = vi.fn();
  const { getByRole, unmount } = render(
    <DisplayModeButton scope="participant" value={value} onChange={onChange} />,
  );
  fireEvent.click(getByRole('button'));
  unmount();
  return onChange;
};

describe('DisplayModeButton', () => {
  it('cycles both → translation → source → none → both', () => {
    expect(click('both')).toHaveBeenCalledWith('translation');
    expect(click('translation')).toHaveBeenCalledWith('source');
    expect(click('source')).toHaveBeenCalledWith('none');
    expect(click('none')).toHaveBeenCalledWith('both');
  });

  it('exposes scope and mode as data attributes', () => {
    render(<DisplayModeButton scope="speaker" value="none" onChange={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-scope', 'speaker');
    expect(btn).toHaveAttribute('data-mode', 'none');
  });

  it('labels the hidden mode', () => {
    render(<DisplayModeButton scope="participant" value="none" onChange={() => {}} />);
    // i18n may resolve to a translation in some environments; the English
    // default is what ships in en/translation.json.
    expect(screen.getByRole('button').textContent).toMatch(/Off|关闭|隐藏/);
  });
});
