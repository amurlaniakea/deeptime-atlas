// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { BOUNDARIES } from '../src/data/boundaries';
import { SOURCES, SOURCES_BY_ID } from '../src/data/sources';
import { EARTH_AGE_MA, RAW_UNITS } from '../src/data/units';
import { ROOT_ID, buildTree } from '../src/lib/timescale';

const RANK_ORDER = ['root', 'eon', 'era', 'period', 'epoch', 'age'];

describe('dataset integrity', () => {
  const tree = buildTree(RAW_UNITS);

  it('has unique ids', () => {
    expect(new Set(RAW_UNITS.map((u) => u.id)).size).toBe(RAW_UNITS.length);
  });

  it('every unit has names in es, en and fr', () => {
    for (const u of RAW_UNITS) {
      for (const l of ['es', 'en', 'fr'] as const) expect(u.names[l].trim().length, `${u.id}.${l}`).toBeGreaterThan(0);
    }
  });

  it('every unit cites at least one existing source', () => {
    for (const u of RAW_UNITS) {
      expect(u.sources.length, u.id).toBeGreaterThan(0);
      for (const s of u.sources) expect(SOURCES_BY_ID.has(s), `${u.id} -> ${s}`).toBe(true);
    }
  });

  it('sources have https URLs, ISO access dates and well-formed DOIs', () => {
    for (const s of SOURCES) {
      expect(s.url.startsWith('https://'), s.id).toBe(true);
      expect(s.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (s.doi) expect(s.doi).toMatch(/^10\.\d{4,9}\/\S+$/);
    }
  });

  it('colours, when given, are 6-digit hex', () => {
    for (const u of RAW_UNITS) if (u.color) expect(u.color, u.id).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('ranks descend one level at a time', () => {
    for (const u of tree.values()) {
      if (!u.parent) continue;
      const p = tree.get(u.parent)!;
      expect(RANK_ORDER.indexOf(u.rank) - RANK_ORDER.indexOf(p.rank), u.id).toBe(1);
    }
  });

  it('children tile their parent exactly: first child starts where the parent starts', () => {
    for (const u of tree.values()) {
      if (u.children.length === 0) continue;
      const first = tree.get(u.children[0]!)!;
      expect(first.startMa, u.id).toBe(u.startMa);
    }
  });

  it('every unit has positive duration and ends where its younger sibling begins', () => {
    for (const u of tree.values()) {
      expect(u.startMa, u.id).toBeGreaterThan(u.endMa);
      u.children.forEach((cid, i) => {
        const c = tree.get(cid)!;
        const next = i + 1 < u.children.length ? tree.get(u.children[i + 1]!)!.startMa : u.endMa;
        expect(c.endMa, cid).toBe(next);
      });
    }
  });

  it('top-level units cover the whole of Earth history', () => {
    const root = tree.get(ROOT_ID)!;
    expect(root.startMa).toBe(EARTH_AGE_MA);
    expect(root.endMa).toBe(0);
    expect(tree.get(root.children[0]!)!.startMa).toBe(EARTH_AGE_MA);
  });

  it('uncertainties are positive numbers', () => {
    for (const u of RAW_UNITS) if (u.startErr !== undefined) expect(u.startErr, u.id).toBeGreaterThan(0);
  });

  it('the Cenozoic is described down to stage level', () => {
    for (const epoch of ['paleocene', 'eocene', 'oligocene', 'miocene', 'pliocene']) {
      expect(tree.get(epoch)!.children.length, epoch).toBeGreaterThanOrEqual(2);
    }
    expect(tree.get('pliocene')!.children).toEqual(['zanclean', 'piacenzian']);
    expect(tree.get('piacenzian')!.endMa).toBe(2.58);
  });
});

describe('boundary definitions', () => {
  const tree = buildTree(RAW_UNITS);

  it('are unique and reference existing units and sources', () => {
    expect(new Set(BOUNDARIES.map((b) => b.id)).size).toBe(BOUNDARIES.length);
    for (const b of BOUNDARIES) {
      expect(b.appliesTo.length, b.id).toBeGreaterThan(0);
      for (const id of b.appliesTo) expect(tree.has(id), `${b.id} -> ${id}`).toBe(true);
      expect(b.sources.length, b.id).toBeGreaterThan(0);
      for (const s of b.sources) expect(SOURCES_BY_ID.has(s), `${b.id} -> ${s}`).toBe(true);
    }
  });

  it('all units sharing a boundary start at the same age', () => {
    for (const b of BOUNDARIES) {
      const ages = new Set(b.appliesTo.map((id) => tree.get(id)!.startMa));
      expect(ages.size, b.id).toBe(1);
    }
  });

  it('a unit has at most one boundary definition', () => {
    const seen = new Set<string>();
    for (const b of BOUNDARIES) for (const id of b.appliesTo) {
      expect(seen.has(id), id).toBe(false);
      seen.add(id);
    }
  });

  it('have marker and location in es, en and fr, and a sane ratification year', () => {
    for (const b of BOUNDARIES) {
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(b.marker[l].trim().length, `${b.id}.marker.${l}`).toBeGreaterThan(10);
        expect(b.location[l].trim().length, `${b.id}.location.${l}`).toBeGreaterThan(3);
      }
      if (b.ratified !== undefined) expect(b.ratified).toBeGreaterThan(1970);
    }
  });
});

