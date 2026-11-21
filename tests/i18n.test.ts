// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { DICTS, LANGS, detectLang } from '../src/i18n';

describe('i18n', () => {
  it('all languages define exactly the same keys with non-empty text', () => {
    const base = Object.keys(DICTS.en).sort();
    for (const l of LANGS) {
      expect(Object.keys(DICTS[l]).sort(), l).toEqual(base);
      for (const k of base) expect((DICTS[l] as Record<string, string>)[k]!.trim().length, `${l}:${k}`).toBeGreaterThan(0);
    }
  });

  it('keeps the {v} placeholder in every translation of status.planned', () => {
    for (const l of LANGS) expect(DICTS[l]['status.planned']).toContain('{v}');
  });

  it('detects the language: URL > stored > browser > English', () => {
    expect(detectLang('?lang=fr', 'es', ['en-US'])).toBe('fr');
    expect(detectLang('', 'es', ['en-US'])).toBe('es');
    expect(detectLang('', null, ['fr-CA', 'en'])).toBe('fr');
    expect(detectLang('', null, ['de-DE'])).toBe('en');
    expect(detectLang('?lang=xx', null, [])).toBe('en');
  });
});
