/**
 * @fileoverview Core utility functions for CarbonWise carbon calculations.
 * All functions are pure (no side effects) and fully testable.
 * @module utils
 */

'use strict';

/** @constant {number} Maximum daily emissions threshold in kg CO₂ */
const MAX_EMISSIONS = 27;

/** @constant {number} Global daily average emissions in kg CO₂ */
const GLOBAL_AVERAGE = 13.5;

/** @constant {number} Maximum permitted quantity for a single log entry */
const MAX_QUANTITY = 10000;

/** @constant {number} Maximum length in characters for a log entry name */
const MAX_NAME_LENGTH = 100;

/** @constant {number} Number of days in a week for history tracking */
const WEEK_LENGTH = 7;

/**
 * Sanitizes a string value to prevent XSS injection.
 * Encodes HTML special characters; strips nothing.
 * @param {*} str - The value to sanitize.
 * @returns {string} The sanitized string, or '' if input is not a string.
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes a log entry object before storing.
 * Rejects entries with negative or non-numeric co2 / qty values.
 * @param {Object|null|undefined} entry - The raw log entry to sanitize.
 * @returns {Object|null} The sanitized entry, or null if the entry is invalid.
 */
function sanitizeLogEntry(entry) {
    if (!entry || typeof entry !== 'object') return null;
    const co2 = parseFloat(entry.co2);
    const qty = parseFloat(entry.qty);
    if (isNaN(co2) || co2 < 0) return null;
    if (isNaN(qty) || qty < 0) return null;
    return {
        id: parseInt(entry.id) || Date.now(),
        co2: parseFloat(co2.toFixed(4)),
        qty: parseFloat(qty.toFixed(4)),
        nm: sanitizeString(String(entry.nm || '')).slice(0, MAX_NAME_LENGTH),
        ic: sanitizeString(String(entry.ic || '')).slice(0, 10),
        u: sanitizeString(String(entry.u || '')).slice(0, 20),
    };
}

/**
 * Safely parses a JSON string from storage without throwing.
 * Rejects non-object values (e.g. arrays, primitives).
 * @param {*} raw - Raw JSON string from storage.
 * @returns {Object|null} Parsed plain object, or null on any failure.
 */
function safeParseStorage(raw) {
    if (!raw || typeof raw !== 'string') return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return null;
        return parsed;
    } catch {
        return null;
    }
}

/**
 * Calculates the total CO₂ emissions from an array of log entries.
 * Skips entries with missing, negative, or non-numeric co2 values.
 * @param {Array<{co2: number}>|null|undefined} logs - Array of log objects.
 * @returns {number} Total CO₂ emissions rounded to 4 decimal places, or 0.
 */
function calculateTotalEmissions(logs) {
    if (!logs || !Array.isArray(logs)) return 0;
    const total = logs.reduce((sum, log) => {
        const val = parseFloat(log.co2);
        return sum + (isNaN(val) || val < 0 ? 0 : val);
    }, 0);
    return parseFloat(total.toFixed(4));
}

/**
 * Builds a 7-element weekly emissions array, replacing the last slot with today.
 * Short histories are right-padded with zeros; arrays longer than 7 are trimmed to the first 6 + today.
 * The original history array is never mutated.
 * @param {Array<number>|null|undefined} history - Previous days' emissions (up to 6 values used).
 * @param {number} currentTotal - Today's total emissions in kg CO₂.
 * @returns {number[]} A new 7-element array of daily emissions.
 */
function calculateWeeklyData(history, currentTotal) {
    if (!history || !Array.isArray(history)) return new Array(WEEK_LENGTH).fill(0);
    const data = Array.from({ length: WEEK_LENGTH }, (_, i) => {
        const val = parseFloat(history[i]);
        return isNaN(val) || val < 0 ? 0 : val;
    });
    const today = parseFloat(currentTotal);
    data[WEEK_LENGTH - 1] = isNaN(today) ? 0 : parseFloat(today.toFixed(4));
    return data;
}

/**
 * Calculates an impact score from 0–100 based on emissions vs a maximum threshold.
 * A higher score indicates lower emissions (better environmental impact).
 * @param {number} totalEmissions - The total emissions in kg CO₂.
 * @param {number} [maxEmissions=MAX_EMISSIONS] - The maximum daily emissions threshold in kg.
 * @returns {number} Integer score clamped to [0, 100], or 0 for invalid inputs.
 */
function calculateImpactScore(totalEmissions, maxEmissions = MAX_EMISSIONS) {
    const emissions = parseFloat(totalEmissions);
    const max = parseFloat(maxEmissions);
    if (isNaN(emissions) || isNaN(max) || max <= 0) return 0;
    return Math.round(Math.max(0, Math.min(100, 100 - ((emissions / max) * 100))));
}

/**
 * Determines the carbon grade (A+ through D) based on total daily emissions.
 * Boundary values are inclusive on the upper end (e.g. ≤6 kg → A+, ≤10 kg → A).
 * @param {number} totalEmissions - Total daily emissions in kg CO₂.
 * @returns {'A+'|'A'|'B'|'C'|'D'} The carbon grade string.
 */
function calculateGrade(totalEmissions) {
    const kg = parseFloat(totalEmissions);
    if (isNaN(kg) || kg < 0) return 'D';
    if (kg <= 6) return 'A+';
    if (kg <= 10) return 'A';
    if (kg <= GLOBAL_AVERAGE) return 'B';
    if (kg <= 20) return 'C';
    return 'D';
}

/**
 * Calculates the weekly average emissions, ignoring zero-emission days.
 * Zero days are treated as non-logging days and excluded from the average.
 * @param {Array<number>|null|undefined} weeklyData - Array of daily emission values (typically 7).
 * @returns {number} Average emission value rounded to 4 decimal places, or 0 if no data.
 */
function calculateWeeklyAverage(weeklyData) {
    if (!weeklyData || !Array.isArray(weeklyData)) return 0;
    const nonZero = weeklyData.filter(v => {
        const n = parseFloat(v);
        return !isNaN(n) && n > 0;
    });
    if (!nonZero.length) return 0;
    const sum = nonZero.reduce((a, b) => a + parseFloat(b), 0);
    return parseFloat((sum / nonZero.length).toFixed(4));
}

/**
 * Formats a CO₂ value for display with 2 decimal places and units.
 * Handles NaN and non-numeric input gracefully.
 * @param {number} kg - The value in kg CO₂.
 * @returns {string} Formatted string (e.g. "12.34 kg"), or "0.00 kg" for invalid input.
 */
function formatEmissions(kg) {
    const val = parseFloat(kg);
    if (isNaN(val)) return '0.00 kg';
    return `${val.toFixed(2)} kg`;
}

/**
 * Validates a quantity input value for log entries.
 * The value must be a finite, non-negative number within the allowed maximum.
 * @param {*} qty - The raw quantity value to validate.
 * @param {number} [maxQty=MAX_QUANTITY] - Maximum allowed quantity.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateQuantity(qty, maxQty = MAX_QUANTITY) {
    const val = parseFloat(qty);
    if (isNaN(val) || !isFinite(val)) return false;
    if (val < 0) return false;
    if (val > maxQty) return false;
    return true;
}

/**
 * Converts a daily CO₂ total into a set of real-world equivalent comparisons.
 * All factors are approximate and based on commonly used environmental data.
 * @param {number} kg - Daily CO₂ total in kg.
 * @returns {{ trees: number, kmDriven: number, ledHours: number, phoneCharges: number, acHours: number }}
 *   Object with rounded real-world equivalents.
 */
function calculateCarbonEquivalents(kg) {
    const val = parseFloat(kg);
    if (isNaN(val) || val < 0) {
        return { trees: 0, kmDriven: 0, ledHours: 0, phoneCharges: 0, acHours: 0 };
    }
    return {
        trees: parseFloat((val / 21.77).toFixed(2)),
        kmDriven: Math.round(val * 6.24),
        ledHours: Math.round(val * 277.7),
        phoneCharges: Math.round(val * 333.3),
        acHours: parseFloat((val / 0.82).toFixed(1)),
    };
}

/**
 * Groups an array of log entries by their category and sums the CO₂ per category.
 * Returns zero values for categories with no entries.
 * @param {Array<{cat: string, co2: number}>|null|undefined} logs - Log entries to categorise.
 * @returns {{ transport: number, food: number, home: number, shopping: number }}
 *   Object with total CO₂ per category, rounded to 4 decimal places.
 */
function categorizeEmissions(logs) {
    const result = { transport: 0, food: 0, home: 0, shopping: 0 };
    if (!logs || !Array.isArray(logs)) return result;
    logs.forEach(log => {
        const val = parseFloat(log.co2);
        const cat = log.cat;
        if (!isNaN(val) && val >= 0 && Object.prototype.hasOwnProperty.call(result, cat)) {
            result[cat] = parseFloat((result[cat] + val).toFixed(4));
        }
    });
    return result;
}

/**
 * Converts a daily CO₂ total to an estimated annual pace in metric tonnes.
 * @param {number} dailyTotal - Today's total emissions in kg CO₂.
 * @returns {number} Estimated annual CO₂ in tonnes, rounded to 2 decimal places, or 0.
 */
function calculateAnnualPace(dailyTotal) {
    const val = parseFloat(dailyTotal);
    if (isNaN(val) || val < 0) return 0;
    return parseFloat(((val * 365) / 1000).toFixed(2));
}


/** @constant {number} Paris Agreement 2030 per-capita daily CO₂ target in kg */
const PARIS_TARGET_DAILY = 2.5;

/** @constant {number} Paris Agreement 2030 per-capita annual CO₂ budget in tonnes */
const PARIS_TARGET_ANNUAL = 0.9125;

/**
 * Checks whether daily emissions are on track with the Paris Agreement 2030 target.
 * The Paris Agreement targets 1.5°C warming limit, requiring ~2.5 kg CO₂/person/day by 2030.
 * @param {number} dailyKg - Today's total emissions in kg CO₂.
 * @returns {{onTrack: boolean, kgOver: number, annualPace: number, parisAnnual: number}}
 *   onTrack: true if emissions are at or below the Paris target.
 *   kgOver: how many kg above the target (0 if on track).
 *   annualPace: estimated annual emissions in tonnes at this daily rate.
 *   parisAnnual: the Paris annual budget in tonnes (0.9125).
 */
function checkParisAlignment(dailyKg) {
    const val = parseFloat(dailyKg);
    if (isNaN(val) || val < 0) {
        return { onTrack: false, kgOver: PARIS_TARGET_DAILY, annualPace: 0, parisAnnual: PARIS_TARGET_ANNUAL };
    }
    return {
        onTrack: val <= PARIS_TARGET_DAILY,
        kgOver: parseFloat(Math.max(0, val - PARIS_TARGET_DAILY).toFixed(2)),
        annualPace: parseFloat(((val * 365) / 1000).toFixed(2)),
        parisAnnual: PARIS_TARGET_ANNUAL,
    };
}

// ── Exports (Node/Jest environment only) ────────────────────────────────────
/* istanbul ignore next — browser environment branch, untestable in Jest */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Constants
        MAX_EMISSIONS,
        GLOBAL_AVERAGE,
        MAX_QUANTITY,
        MAX_NAME_LENGTH,
        WEEK_LENGTH,
        // Core calculators
        calculateTotalEmissions,
        calculateWeeklyData,
        calculateImpactScore,
        calculateGrade,
        calculateWeeklyAverage,
        calculateAnnualPace,
        checkParisAlignment,
        PARIS_TARGET_DAILY,
        PARIS_TARGET_ANNUAL,
        // Formatters
        formatEmissions,
        calculateCarbonEquivalents,
        // Categorization
        categorizeEmissions,
        // Validators / sanitizers
        validateQuantity,
        sanitizeString,
        sanitizeLogEntry,
        safeParseStorage,
    };
}
