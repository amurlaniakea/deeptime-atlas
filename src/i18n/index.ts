// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { en, type Dict } from './en';
import { es } from './es';
import { fr } from './fr';

export type { Dict };
export const LANGS = ['es', 'en', 'fr'] as const;
export type Lang = (typeof LANGS)[number];
export const DICTS: Readonly<Record<Lang, Dict>> = { en, es, fr };
export const LANG_NAMES: Readonly<Record<Lang, string>> = { es: 'Español', en: 'English', fr: 'Français' };

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as readonly string[]).includes(v);
}

/** Priority: ?lang= in the URL, then the stored choice, then the browser languages, then English. */
export function detectLang(search: string, stored: string | null, browser: readonly string[]): Lang {
  const fromUrl = new URLSearchParams(search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  if (isLang(stored)) return stored;
  for (const b of browser) {
    const base = b.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return 'en';
}
