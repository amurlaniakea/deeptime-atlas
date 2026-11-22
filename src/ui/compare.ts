// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import type { Dict, Lang } from '../i18n';
import { compareUnits, durationOf, flatOrder, formatRatio, formatSpan, textColorFor, type Tree, type Unit } from '../lib/timescale';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function mountCompare(host: HTMLElement, tree: Tree, lang: Lang, dict: Dict, initial: [string, string]): void {
  const options = flatOrder(tree);
  let a = initial[0];
  let b = initial[1];

  const makeSelect = (label: string, get: () => string, set: (v: string) => void): HTMLElement => {
    const wrap = el('label', 'cmp-field');
    wrap.append(el('span', undefined, label));
    const sel = el('select');
    for (const { unit, depth } of options) {
      const o = el('option', undefined, `${'\u2003'.repeat(depth)}${unit.names[lang]}`);
      o.value = unit.id;
      sel.append(o);
    }
    sel.value = get();
    sel.addEventListener('change', () => { set(sel.value); draw(); });
    wrap.append(sel);
    return wrap;
  };

  const result = el('div', 'cmp-result');
  result.setAttribute('aria-live', 'polite');

  function bar(u: Unit, max: number): HTMLElement {
    const row = el('div', 'cmp-row');
    row.append(el('span', 'cmp-name', u.names[lang]));
    const track = el('div', 'cmp-track');
    const fill = el('div', 'cmp-fill');
    fill.style.width = `${Math.max(0.4, (durationOf(u) / max) * 100)}%`;
    fill.style.background = u.color;
    fill.style.color = textColorFor(u.color);
    track.append(fill);
    row.append(track, el('span', 'cmp-value', formatSpan(durationOf(u), lang)));
    return row;
  }

  function draw(): void {
    const ua = tree.get(a)!;
    const ub = tree.get(b)!;
    const max = Math.max(durationOf(ua), durationOf(ub));
    const c = compareUnits(ua, ub);
    const sentence = c.ratio < 1.05
      ? dict['compare.same'].replace('{long}', c.longer.names[lang]).replace('{short}', c.shorter.names[lang])
      : dict['compare.ratio'].replace('{long}', c.longer.names[lang]).replace('{x}', formatRatio(c.ratio, lang)).replace('{short}', c.shorter.names[lang]);
    result.replaceChildren(bar(ua, max), bar(ub, max), el('p', 'cmp-sentence', sentence));
  }

  const fields = el('div', 'cmp-fields');
  fields.append(
    makeSelect(dict['compare.a'], () => a, (v) => { a = v; }),
    makeSelect(dict['compare.b'], () => b, (v) => { b = v; }),
  );
  host.replaceChildren(fields, result);
  draw();
}
