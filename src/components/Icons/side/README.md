# Side icons — source files

Delivered by an external designer on 2026-09-07 against the brief for
kizuna-ai-lab/sokuji#510. These SVGs are the source of truth;
`../SideIcons.tsx` reproduces them as React components, and
`../SideIcons.test.tsx` fails if the two ever drift.

- `side-me.svg` — two speech bubbles, one right tail each: the user.
- `side-other.svg` — two speech bubbles, two left tails each: the other side, plural.
- `side-both.svg` — Other's upper bubble over Me's lower bubble.
- `side-{me,other}--{both,translation,source,none}.svg` — the four display
  modes expanded: upper path = original line, lower path = translation line,
  `fill="currentColor"` when shown, `fill="none"` when hidden; `d` and
  `stroke` never change.

24-unit viewBox, paths only, `currentColor`, 2-unit round stroke, rendered at
14 px. `side-me.svg` and `side-other.svg` are byte-identical to their
`--both` files.

One local change from the delivery: `side-both.svg`'s paths were renamed from
`line-source` / `line-translation` to `side-other` / `side-me`, because Both
never toggles and the original names described Me/Other's lines, not Both's.
