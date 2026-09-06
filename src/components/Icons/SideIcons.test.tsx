import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SideMeIcon, SideOtherIcon, SideBothIcon } from './SideIcons';
import type { DisplayMode } from '../../stores/settingsStore';

const svgFile = (name: string) =>
  new DOMParser().parseFromString(
    readFileSync(resolve(__dirname, 'side', `${name}.svg`), 'utf8'),
    'image/svg+xml',
  );

const pathsOf = (root: ParentNode) =>
  Array.from(root.querySelectorAll('path')).map((p) => ({
    cls: p.getAttribute('class'),
    d: p.getAttribute('d'),
    fill: p.getAttribute('fill'),
    stroke: p.getAttribute('stroke'),
    strokeWidth: p.getAttribute('stroke-width'),
  }));

const MODES: DisplayMode[] = ['both', 'translation', 'source', 'none'];

describe('SideIcons', () => {
  it('render one svg with exactly two paths and a data-icon name', () => {
    for (const [Icon, name] of [[SideMeIcon, 'side-me'], [SideOtherIcon, 'side-other'], [SideBothIcon, 'side-both']] as const) {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg')!;
      expect(svg.getAttribute('data-icon')).toBe(name);
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.querySelectorAll('path')).toHaveLength(2);
    }
  });

  it('size sets width and height, default 24', () => {
    const { container } = render(<SideMeIcon size={14} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '14');
    expect(container.querySelector('svg')).toHaveAttribute('height', '14');
    const def = render(<SideOtherIcon />).container.querySelector('svg')!;
    expect(def.getAttribute('width')).toBe('24');
  });

  it('Me and Other reproduce the designer files in every mode', () => {
    for (const [Icon, name] of [[SideMeIcon, 'side-me'], [SideOtherIcon, 'side-other']] as const) {
      for (const mode of MODES) {
        const { container } = render(<Icon mode={mode} />);
        expect(pathsOf(container), `${name}--${mode}`).toEqual(pathsOf(svgFile(`${name}--${mode}`)));
      }
      // The base file is the both form.
      const { container } = render(<Icon />);
      expect(pathsOf(container), `${name} default`).toEqual(pathsOf(svgFile(name)));
    }
  });

  it('Both reproduces side-both.svg and is always fully shown', () => {
    const { container } = render(<SideBothIcon />);
    expect(pathsOf(container)).toEqual(pathsOf(svgFile('side-both')));
    for (const p of pathsOf(container)) expect(p.fill).toBe('currentColor');
    expect(pathsOf(container).map((p) => p.cls)).toEqual(['side-other', 'side-me']);
  });

  it('hidden lines keep their geometry and stroke', () => {
    const shown = pathsOf(render(<SideMeIcon mode="both" />).container);
    const hidden = pathsOf(render(<SideMeIcon mode="none" />).container);
    expect(hidden.map((p) => p.d)).toEqual(shown.map((p) => p.d));
    expect(hidden.map((p) => p.stroke)).toEqual(['currentColor', 'currentColor']);
    expect(hidden.map((p) => p.fill)).toEqual(['none', 'none']);
  });
});
