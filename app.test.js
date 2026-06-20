/**
 * @fileoverview Comprehensive test suite for CarbonWise utility functions.
 * Target: 95%+ branch coverage across all calculation, formatting,
 * validation, and sanitization logic.
 */

'use strict';

const {
    calculateTotalEmissions,
    calculateWeeklyData,
    calculateImpactScore,
    calculateGrade,
    calculateWeeklyAverage,
    formatEmissions,
    sanitizeString,
    sanitizeLogEntry,
    safeParseStorage,
    validateQuantity,
    calculateCarbonEquivalents,
    categorizeEmissions,
    calculateAnnualPace,
    checkParisAlignment,
    PARIS_TARGET_DAILY,
    PARIS_TARGET_ANNUAL,
    MAX_EMISSIONS,
    GLOBAL_AVERAGE,
    MAX_QUANTITY,
    MAX_NAME_LENGTH,
    WEEK_LENGTH,
} = require('./utils');

// ─── calculateTotalEmissions ─────────────────────────────────────────────────
describe('calculateTotalEmissions', () => {
    test('sums valid co2 values correctly', () => {
        const logs = [{ co2: 5 }, { co2: 2.5 }, { co2: 0 }];
        expect(calculateTotalEmissions(logs)).toBe(7.5);
    });

    test('returns 0 for empty array', () => {
        expect(calculateTotalEmissions([])).toBe(0);
    });

    test('returns 0 for null input', () => {
        expect(calculateTotalEmissions(null)).toBe(0);
    });

    test('returns 0 for undefined input', () => {
        expect(calculateTotalEmissions(undefined)).toBe(0);
    });

    test('ignores entries with missing co2 property', () => {
        const logs = [{ co2: 5 }, { invalid: 2.5 }];
        expect(calculateTotalEmissions(logs)).toBe(5);
    });

    test('ignores entries with negative co2 values', () => {
        const logs = [{ co2: 5 }, { co2: -2 }];
        expect(calculateTotalEmissions(logs)).toBe(5);
    });

    test('ignores entries with NaN co2 values', () => {
        const logs = [{ co2: 5 }, { co2: NaN }, { co2: 'abc' }];
        expect(calculateTotalEmissions(logs)).toBe(5);
    });

    test('handles single entry', () => {
        expect(calculateTotalEmissions([{ co2: 6.61 }])).toBe(6.61);
    });

    test('handles large emission values', () => {
        const logs = [{ co2: 100 }, { co2: 200 }];
        expect(calculateTotalEmissions(logs)).toBe(300);
    });

    test('handles all zero emissions', () => {
        const logs = [{ co2: 0 }, { co2: 0 }];
        expect(calculateTotalEmissions(logs)).toBe(0);
    });

    test('returns 0 when passed a non-array (string)', () => {
        expect(calculateTotalEmissions('abc')).toBe(0);
    });

    test('returns 0 when passed a non-array (number)', () => {
        expect(calculateTotalEmissions(42)).toBe(0);
    });

    test('returns 0 when passed a non-array (object)', () => {
        expect(calculateTotalEmissions({ co2: 5 })).toBe(0);
    });

    test('handles floating point precision correctly', () => {
        const logs = [{ co2: 0.1 }, { co2: 0.2 }];
        expect(calculateTotalEmissions(logs)).toBeCloseTo(0.3, 4);
    });

    test('rounds total to 4 decimal places', () => {
        const logs = [{ co2: 1.23456 }, { co2: 2.34567 }];
        const result = calculateTotalEmissions(logs);
        expect(result.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(4);
    });

    test('handles string co2 values that parse as numbers', () => {
        const logs = [{ co2: '5.5' }, { co2: 2 }];
        expect(calculateTotalEmissions(logs)).toBeCloseTo(7.5);
    });
});

// ─── calculateWeeklyData ─────────────────────────────────────────────────────
describe('calculateWeeklyData', () => {
    test('appends today to a 7-item history', () => {
        const hist = [1, 2, 3, 4, 5, 6, 0];
        expect(calculateWeeklyData(hist, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('returns 7-element array for empty history', () => {
        const result = calculateWeeklyData([], 5);
        expect(result).toHaveLength(7);
        expect(result[6]).toBe(5);
    });

    test('returns 7-element array for null history', () => {
        const result = calculateWeeklyData(null, 5);
        expect(result).toHaveLength(7);
    });

    test('returns all-zero array for null history when currentTotal is 0', () => {
        const result = calculateWeeklyData(null, 0);
        expect(result).toEqual([0, 0, 0, 0, 0, 0, 0]);
    });

    test('pads short history with zeros', () => {
        const result = calculateWeeklyData([1, 2], 9);
        expect(result).toHaveLength(7);
        expect(result[0]).toBe(1);
        expect(result[2]).toBe(0);
        expect(result[6]).toBe(9);
    });

    test('handles 0 as current total', () => {
        const hist = [5, 4, 3, 2, 1, 6, 99];
        const result = calculateWeeklyData(hist, 0);
        expect(result[6]).toBe(0);
    });

    test('does not mutate the original history array', () => {
        const hist = [1, 2, 3, 4, 5, 6, 0];
        const original = [...hist];
        calculateWeeklyData(hist, 9);
        expect(hist).toEqual(original);
    });

    test('treats NaN history values as 0', () => {
        const result = calculateWeeklyData([NaN, 5, NaN], 3);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(5);
        expect(result[2]).toBe(0);
    });

    test('treats negative history values as 0', () => {
        const result = calculateWeeklyData([-5, 3, -1], 2);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(3);
        expect(result[2]).toBe(0);
    });

    test('uses only first 6 items from a history longer than 7 elements', () => {
        const hist = [1, 2, 3, 4, 5, 6, 99, 88, 77];
        const result = calculateWeeklyData(hist, 10);
        expect(result).toHaveLength(7);
        expect(result[6]).toBe(10);
        // items beyond index 6 should not appear in output
        expect(result).not.toContain(88);
        expect(result).not.toContain(77);
    });

    test('treats NaN currentTotal as 0', () => {
        const result = calculateWeeklyData([1, 2, 3, 4, 5, 6, 0], NaN);
        expect(result[6]).toBe(0);
    });

    test('handles string values in history that are numeric', () => {
        const result = calculateWeeklyData(['3', '4'], 5);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(4);
    });
});

// ─── calculateImpactScore ────────────────────────────────────────────────────
describe('calculateImpactScore', () => {
    test('returns 100 for 0 emissions', () => {
        expect(calculateImpactScore(0)).toBe(100);
    });

    test('returns 0 for exactly max emissions (27)', () => {
        expect(calculateImpactScore(27)).toBe(0);
    });

    test('returns 0 for emissions above max', () => {
        expect(calculateImpactScore(30)).toBe(0);
    });

    test('caps at 100 for negative emissions', () => {
        expect(calculateImpactScore(-5)).toBe(100);
    });

    test('returns 50 for exactly half of max emissions', () => {
        expect(calculateImpactScore(13.5)).toBe(50);
    });

    test('uses custom maxEmissions parameter', () => {
        expect(calculateImpactScore(5, 10)).toBe(50);
    });

    test('returns 0 for maxEmissions of 0', () => {
        expect(calculateImpactScore(5, 0)).toBe(0);
    });

    test('returns 0 for negative maxEmissions', () => {
        expect(calculateImpactScore(5, -1)).toBe(0);
    });

    test('returns 0 for NaN emissions', () => {
        expect(calculateImpactScore(NaN)).toBe(0);
    });

    test('returns 0 for NaN maxEmissions', () => {
        expect(calculateImpactScore(5, NaN)).toBe(0);
    });

    test('always returns an integer', () => {
        const score = calculateImpactScore(8.3);
        expect(Number.isInteger(score)).toBe(true);
    });

    test('returns 100 for very small positive emissions', () => {
        expect(calculateImpactScore(0.001)).toBe(100);
    });

    test('handles very large custom maxEmissions', () => {
        const score = calculateImpactScore(1, 1000);
        expect(score).toBe(100);
    });
});

// ─── calculateGrade ──────────────────────────────────────────────────────────
describe('calculateGrade', () => {
    test('returns A+ for 0 kg (lower bound)', () => {
        expect(calculateGrade(0)).toBe('A+');
    });

    test('returns A+ for exactly 6 kg (upper bound)', () => {
        expect(calculateGrade(6)).toBe('A+');
    });

    test('returns A for 6.01 kg', () => {
        expect(calculateGrade(6.01)).toBe('A');
    });

    test('returns A for exactly 10 kg', () => {
        expect(calculateGrade(10)).toBe('A');
    });

    test('returns B for 10.01 kg', () => {
        expect(calculateGrade(10.01)).toBe('B');
    });

    test('returns B for exactly 13.5 kg (GLOBAL_AVERAGE)', () => {
        expect(calculateGrade(13.5)).toBe('B');
    });

    test('returns C for 13.51 kg', () => {
        expect(calculateGrade(13.51)).toBe('C');
    });

    test('returns C for exactly 20 kg', () => {
        expect(calculateGrade(20)).toBe('C');
    });

    test('returns D for 20.01 kg', () => {
        expect(calculateGrade(20.01)).toBe('D');
    });

    test('returns D for very large values', () => {
        expect(calculateGrade(100)).toBe('D');
    });

    test('returns D for NaN', () => {
        expect(calculateGrade(NaN)).toBe('D');
    });

    test('returns D for negative values', () => {
        expect(calculateGrade(-1)).toBe('D');
    });

    test('returns D for negative infinity', () => {
        expect(calculateGrade(-Infinity)).toBe('D');
    });

    test('returns D for positive infinity', () => {
        expect(calculateGrade(Infinity)).toBe('D');
    });

    test('returns A+ for a string that parses as 5', () => {
        expect(calculateGrade('5')).toBe('A+');
    });
});

// ─── calculateWeeklyAverage ──────────────────────────────────────────────────
describe('calculateWeeklyAverage', () => {
    test('calculates average of non-zero days', () => {
        const avg = calculateWeeklyAverage([8.2, 11.5, 6.8, 14.1, 9.3, 7.6, 0]);
        expect(avg).toBeCloseTo(9.58, 1);
    });

    test('returns 0 for all-zero week', () => {
        expect(calculateWeeklyAverage([0, 0, 0, 0, 0, 0, 0])).toBe(0);
    });

    test('returns 0 for null input', () => {
        expect(calculateWeeklyAverage(null)).toBe(0);
    });

    test('returns 0 for undefined input', () => {
        expect(calculateWeeklyAverage(undefined)).toBe(0);
    });

    test('returns 0 for empty array', () => {
        expect(calculateWeeklyAverage([])).toBe(0);
    });

    test('returns value for single non-zero day', () => {
        expect(calculateWeeklyAverage([0, 0, 0, 0, 0, 0, 10])).toBe(10);
    });

    test('ignores NaN values when computing average', () => {
        const avg = calculateWeeklyAverage([10, NaN, 10]);
        expect(avg).toBe(10);
    });

    test('returns 0 for non-array input', () => {
        expect(calculateWeeklyAverage('10,20')).toBe(0);
    });

    test('rounds result to 4 decimal places', () => {
        const result = calculateWeeklyAverage([1, 2, 3]);
        const decimalParts = result.toString().split('.');
        expect(decimalParts[1]?.length || 0).toBeLessThanOrEqual(4);
    });
});

// ─── formatEmissions ─────────────────────────────────────────────────────────
describe('formatEmissions', () => {
    test('formats a value to 2 decimal places with units', () => {
        expect(formatEmissions(8.2)).toBe('8.20 kg');
    });

    test('formats zero correctly', () => {
        expect(formatEmissions(0)).toBe('0.00 kg');
    });

    test('handles NaN gracefully', () => {
        expect(formatEmissions(NaN)).toBe('0.00 kg');
    });

    test('handles undefined gracefully', () => {
        expect(formatEmissions(undefined)).toBe('0.00 kg');
    });

    test('formats large values correctly', () => {
        expect(formatEmissions(100.5)).toBe('100.50 kg');
    });

    test('formats a string that parses as a number', () => {
        expect(formatEmissions('12.345')).toBe('12.35 kg');
    });

    test('rounds to 2 decimal places', () => {
        expect(formatEmissions(8.999)).toBe('9.00 kg');
    });
});

// ─── sanitizeString ──────────────────────────────────────────────────────────
describe('sanitizeString', () => {
    test('encodes < and > characters', () => {
        expect(sanitizeString('<script>')).toBe('&lt;script&gt;');
    });

    test('encodes ampersands', () => {
        expect(sanitizeString('a & b')).toBe('a &amp; b');
    });

    test('encodes double quotes', () => {
        expect(sanitizeString('"hello"')).toBe('&quot;hello&quot;');
    });

    test('encodes single quotes', () => {
        expect(sanitizeString("it's")).toBe("it&#x27;s");
    });

    test('encodes forward slashes', () => {
        expect(sanitizeString('path/to/file')).toBe('path&#x2F;to&#x2F;file');
    });

    test('returns empty string for null', () => {
        expect(sanitizeString(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
        expect(sanitizeString(undefined)).toBe('');
    });

    test('returns empty string for a number', () => {
        expect(sanitizeString(42)).toBe('');
    });

    test('returns empty string for an object', () => {
        expect(sanitizeString({})).toBe('');
    });

    test('passes through safe strings unchanged', () => {
        expect(sanitizeString('hello world')).toBe('hello world');
    });

    test('handles XSS injection attempt — no < or > in output', () => {
        const xss = '<img src=x onerror=alert(1)>';
        expect(sanitizeString(xss)).not.toContain('<');
        expect(sanitizeString(xss)).not.toContain('>');
    });

    test('handles all special characters in one string', () => {
        const raw = `<"'&/>`;
        const result = sanitizeString(raw);
        // Raw < > " ' / must be replaced with their HTML entity forms
        expect(result).not.toMatch(/(?<!&[a-z#0-9]+)[<>"'/]/);
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
        expect(result).toContain('&quot;');
        expect(result).toContain('&#x27;');
        expect(result).toContain('&#x2F;');
        expect(result).toContain('&amp;');
    });

    test('encodes ampersand before other characters to avoid double-encoding', () => {
        expect(sanitizeString('&lt;')).toBe('&amp;lt;');
    });

    test('handles empty string', () => {
        expect(sanitizeString('')).toBe('');
    });
});

// ─── sanitizeLogEntry ────────────────────────────────────────────────────────
describe('sanitizeLogEntry', () => {
    test('returns a sanitized entry for fully valid input', () => {
        const entry = { id: 1, co2: 5.5, qty: 10, nm: 'Car', ic: '🚗', u: 'km' };
        const result = sanitizeLogEntry(entry);
        expect(result).not.toBeNull();
        expect(result.co2).toBe(5.5);
        expect(result.nm).toBe('Car');
    });

    test('accepts zero co2 (zero-emission activity)', () => {
        const entry = { id: 2, co2: 0, qty: 5, nm: 'Bicycle', ic: '🚲', u: 'km' };
        const result = sanitizeLogEntry(entry);
        expect(result).not.toBeNull();
        expect(result.co2).toBe(0);
    });

    test('accepts zero qty', () => {
        const entry = { id: 3, co2: 2, qty: 0, nm: 'Test', ic: '⚡', u: 'kWh' };
        const result = sanitizeLogEntry(entry);
        expect(result).not.toBeNull();
        expect(result.qty).toBe(0);
    });

    test('returns null for negative co2', () => {
        expect(sanitizeLogEntry({ co2: -1, qty: 5 })).toBeNull();
    });

    test('returns null for NaN co2', () => {
        expect(sanitizeLogEntry({ co2: NaN, qty: 5 })).toBeNull();
    });

    test('returns null for string co2 that does not parse', () => {
        expect(sanitizeLogEntry({ co2: 'bad', qty: 5 })).toBeNull();
    });

    test('returns null for negative qty', () => {
        expect(sanitizeLogEntry({ co2: 5, qty: -1 })).toBeNull();
    });

    test('returns null for NaN qty', () => {
        expect(sanitizeLogEntry({ co2: 5, qty: NaN })).toBeNull();
    });

    test('returns null for null input', () => {
        expect(sanitizeLogEntry(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(sanitizeLogEntry(undefined)).toBeNull();
    });

    test('returns null for a non-object (string)', () => {
        expect(sanitizeLogEntry('not an object')).toBeNull();
    });

    test('sanitizes HTML in the name field', () => {
        const entry = { id: 1, co2: 5, qty: 1, nm: '<b>Car</b>', ic: '🚗', u: 'km' };
        const result = sanitizeLogEntry(entry);
        expect(result.nm).not.toContain('<b>');
    });

    test('truncates name to 100 characters', () => {
        const longName = 'A'.repeat(150);
        const entry = { id: 1, co2: 5, qty: 1, nm: longName, ic: '🚗', u: 'km' };
        const result = sanitizeLogEntry(entry);
        expect(result.nm.length).toBeLessThanOrEqual(100);
    });

    test('handles missing optional fields gracefully', () => {
        const entry = { co2: 3, qty: 2 };
        const result = sanitizeLogEntry(entry);
        expect(result).not.toBeNull();
        expect(result.nm).toBe('');
        expect(result.ic).toBe('');
        expect(result.u).toBe('');
    });

    test('rounds co2 to 4 decimal places', () => {
        const entry = { co2: 5.123456789, qty: 1 };
        const result = sanitizeLogEntry(entry);
        expect(result.co2.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(4);
    });

    test('falls back to Date.now() when id is missing', () => {
        const before = Date.now();
        const entry = { co2: 5, qty: 1 };
        const result = sanitizeLogEntry(entry);
        const after = Date.now();
        expect(result.id).toBeGreaterThanOrEqual(before);
        expect(result.id).toBeLessThanOrEqual(after);
    });
});

// ─── safeParseStorage ────────────────────────────────────────────────────────
describe('safeParseStorage', () => {
    test('parses a valid JSON object', () => {
        const result = safeParseStorage('{"key":"value"}');
        expect(result).toEqual({ key: 'value' });
    });

    test('parses a nested object', () => {
        const result = safeParseStorage('{"outer":{"inner":42}}');
        expect(result).toEqual({ outer: { inner: 42 } });
    });

    test('returns null for invalid JSON', () => {
        expect(safeParseStorage('not json')).toBeNull();
    });

    test('returns null for a JSON array', () => {
        expect(safeParseStorage('[1,2,3]')).toBeNull();
    });

    test('returns null for a JSON primitive (number)', () => {
        expect(safeParseStorage('42')).toBeNull();
    });

    test('returns null for a JSON primitive (string)', () => {
        expect(safeParseStorage('"hello"')).toBeNull();
    });

    test('returns null for a JSON null value', () => {
        expect(safeParseStorage('null')).toBeNull();
    });

    test('returns null for a JSON boolean', () => {
        expect(safeParseStorage('true')).toBeNull();
    });

    test('returns null for null input', () => {
        expect(safeParseStorage(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(safeParseStorage(undefined)).toBeNull();
    });

    test('returns null for empty string', () => {
        expect(safeParseStorage('')).toBeNull();
    });

    test('returns null for a non-string number', () => {
        expect(safeParseStorage(42)).toBeNull();
    });

    test('returns null for a non-string object', () => {
        expect(safeParseStorage({ key: 'value' })).toBeNull();
    });

    test('handles an empty object {}', () => {
        expect(safeParseStorage('{}')).toEqual({});
    });
});

// ─── validateQuantity ────────────────────────────────────────────────────────
describe('validateQuantity', () => {
    test('accepts a positive number', () => {
        expect(validateQuantity(10)).toBe(true);
    });

    test('accepts zero', () => {
        expect(validateQuantity(0)).toBe(true);
    });

    test('accepts a decimal value', () => {
        expect(validateQuantity(0.5)).toBe(true);
    });

    test('accepts a string that parses as a valid number', () => {
        expect(validateQuantity('5.5')).toBe(true);
    });

    test('rejects a negative number', () => {
        expect(validateQuantity(-1)).toBe(false);
    });

    test('rejects NaN', () => {
        expect(validateQuantity(NaN)).toBe(false);
    });

    test('rejects Infinity', () => {
        expect(validateQuantity(Infinity)).toBe(false);
    });

    test('rejects a string that does not parse', () => {
        expect(validateQuantity('abc')).toBe(false);
    });

    test('rejects null', () => {
        expect(validateQuantity(null)).toBe(false);
    });

    test('rejects value above default MAX_QUANTITY', () => {
        expect(validateQuantity(10001)).toBe(false);
    });

    test('accepts value equal to default MAX_QUANTITY', () => {
        expect(validateQuantity(10000)).toBe(true);
    });

    test('respects a custom maxQty', () => {
        expect(validateQuantity(100, 50)).toBe(false);
        expect(validateQuantity(50, 50)).toBe(true);
    });
});

// ─── calculateCarbonEquivalents ──────────────────────────────────────────────
describe('calculateCarbonEquivalents', () => {
    test('returns correct equivalents for 0 kg', () => {
        const result = calculateCarbonEquivalents(0);
        expect(result.trees).toBe(0);
        expect(result.kmDriven).toBe(0);
        expect(result.ledHours).toBe(0);
        expect(result.phoneCharges).toBe(0);
        expect(result.acHours).toBe(0);
    });

    test('returns zero equivalents for NaN', () => {
        const result = calculateCarbonEquivalents(NaN);
        expect(result.trees).toBe(0);
        expect(result.kmDriven).toBe(0);
    });

    test('returns zero equivalents for negative kg', () => {
        const result = calculateCarbonEquivalents(-5);
        expect(result.trees).toBe(0);
    });

    test('calculates trees correctly for 13.5 kg', () => {
        const result = calculateCarbonEquivalents(13.5);
        expect(result.trees).toBeCloseTo(13.5 / 21.77, 2);
    });

    test('calculates kmDriven correctly for 10 kg', () => {
        const result = calculateCarbonEquivalents(10);
        expect(result.kmDriven).toBe(Math.round(10 * 6.24));
    });

    test('calculates ledHours as integer', () => {
        const result = calculateCarbonEquivalents(5);
        expect(Number.isInteger(result.ledHours)).toBe(true);
    });

    test('calculates phoneCharges as integer', () => {
        const result = calculateCarbonEquivalents(5);
        expect(Number.isInteger(result.phoneCharges)).toBe(true);
    });

    test('returns all expected keys', () => {
        const result = calculateCarbonEquivalents(10);
        expect(result).toHaveProperty('trees');
        expect(result).toHaveProperty('kmDriven');
        expect(result).toHaveProperty('ledHours');
        expect(result).toHaveProperty('phoneCharges');
        expect(result).toHaveProperty('acHours');
    });
});

// ─── categorizeEmissions ─────────────────────────────────────────────────────
describe('categorizeEmissions', () => {
    test('returns zero object for empty logs', () => {
        const result = categorizeEmissions([]);
        expect(result).toEqual({ transport: 0, food: 0, home: 0, shopping: 0 });
    });

    test('returns zero object for null input', () => {
        const result = categorizeEmissions(null);
        expect(result).toEqual({ transport: 0, food: 0, home: 0, shopping: 0 });
    });

    test('sums transport correctly', () => {
        const logs = [
            { cat: 'transport', co2: 5 },
            { cat: 'transport', co2: 3 },
        ];
        const result = categorizeEmissions(logs);
        expect(result.transport).toBe(8);
        expect(result.food).toBe(0);
    });

    test('sums all four categories correctly', () => {
        const logs = [
            { cat: 'transport', co2: 2 },
            { cat: 'food', co2: 3 },
            { cat: 'home', co2: 4 },
            { cat: 'shopping', co2: 5 },
        ];
        const result = categorizeEmissions(logs);
        expect(result.transport).toBe(2);
        expect(result.food).toBe(3);
        expect(result.home).toBe(4);
        expect(result.shopping).toBe(5);
    });

    test('ignores logs with unknown categories', () => {
        const logs = [{ cat: 'unknown', co2: 10 }];
        const result = categorizeEmissions(logs);
        expect(result).toEqual({ transport: 0, food: 0, home: 0, shopping: 0 });
    });

    test('ignores entries with invalid co2', () => {
        const logs = [
            { cat: 'transport', co2: NaN },
            { cat: 'transport', co2: 5 },
        ];
        const result = categorizeEmissions(logs);
        expect(result.transport).toBe(5);
    });

    test('ignores entries with negative co2', () => {
        const logs = [
            { cat: 'food', co2: -3 },
            { cat: 'food', co2: 7 },
        ];
        const result = categorizeEmissions(logs);
        expect(result.food).toBe(7);
    });
});

// ─── calculateAnnualPace ─────────────────────────────────────────────────────
describe('calculateAnnualPace', () => {
    test('calculates annual pace from daily total', () => {
        // 13.5 kg/day × 365 days / 1000 = 4.9275 tonnes/year
        expect(calculateAnnualPace(13.5)).toBeCloseTo(4.93, 2);
    });

    test('returns 0 for 0 daily total', () => {
        expect(calculateAnnualPace(0)).toBe(0);
    });

    test('returns 0 for NaN', () => {
        expect(calculateAnnualPace(NaN)).toBe(0);
    });

    test('returns 0 for negative daily total', () => {
        expect(calculateAnnualPace(-5)).toBe(0);
    });

    test('rounds result to 2 decimal places', () => {
        const result = calculateAnnualPace(1);
        const parts = result.toString().split('.');
        expect(parts[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    test('converts kg to tonnes (divides by 1000)', () => {
        expect(calculateAnnualPace(1000)).toBeCloseTo(365, 0);
    });
});

// ─── Constants ───────────────────────────────────────────────────────────────
describe('Constants', () => {
    test('MAX_EMISSIONS is 27', () => {
        expect(MAX_EMISSIONS).toBe(27);
    });

    test('GLOBAL_AVERAGE is 13.5', () => {
        expect(GLOBAL_AVERAGE).toBe(13.5);
    });

    test('MAX_QUANTITY is 10000', () => {
        expect(MAX_QUANTITY).toBe(10000);
    });

    test('MAX_NAME_LENGTH is 100', () => {
        expect(MAX_NAME_LENGTH).toBe(100);
    });

    test('WEEK_LENGTH is 7', () => {
        expect(WEEK_LENGTH).toBe(7);
    });
});

// ─── checkParisAlignment ─────────────────────────────────────────────────────
describe('checkParisAlignment', () => {
    test('returns onTrack=true when emissions below Paris target', () => {
        const result = checkParisAlignment(2.0);
        expect(result.onTrack).toBe(true);
        expect(result.kgOver).toBe(0);
    });

    test('returns onTrack=true at exactly the Paris target (2.5 kg)', () => {
        const result = checkParisAlignment(2.5);
        expect(result.onTrack).toBe(true);
        expect(result.kgOver).toBe(0);
    });

    test('returns onTrack=false when emissions above Paris target', () => {
        const result = checkParisAlignment(5.0);
        expect(result.onTrack).toBe(false);
        expect(result.kgOver).toBe(2.5);
    });

    test('calculates annual pace correctly (kg * 365 / 1000)', () => {
        const result = checkParisAlignment(10);
        expect(result.annualPace).toBeCloseTo(3.65, 2);
    });

    test('returns Paris annual budget as 0.9125 tonnes', () => {
        const result = checkParisAlignment(0);
        expect(result.parisAnnual).toBe(0.9125);
    });

    test('handles zero emissions correctly', () => {
        const result = checkParisAlignment(0);
        expect(result.onTrack).toBe(true);
        expect(result.kgOver).toBe(0);
    });

    test('handles NaN input gracefully', () => {
        const result = checkParisAlignment(NaN);
        expect(result.onTrack).toBe(false);
        expect(result.annualPace).toBe(0);
    });

    test('handles negative input gracefully', () => {
        const result = checkParisAlignment(-5);
        expect(result.onTrack).toBe(false);
        expect(result.annualPace).toBe(0);
    });

    test('global average (13.5 kg) is well above Paris target', () => {
        const result = checkParisAlignment(13.5);
        expect(result.onTrack).toBe(false);
        expect(result.kgOver).toBe(11);
    });

    test('PARIS_TARGET_DAILY constant is 2.5', () => {
        expect(PARIS_TARGET_DAILY).toBe(2.5);
    });

    test('PARIS_TARGET_ANNUAL constant is 0.9125', () => {
        expect(PARIS_TARGET_ANNUAL).toBe(0.9125);
    });
});

