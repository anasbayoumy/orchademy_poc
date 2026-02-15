#!/usr/bin/env node
/**
 * Build PLN-01 JSON files from CSV data
 * PLN-01: Optimum Class Size (Lecture) - Normative KPI
 * Granularity: Section; Course; Term
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data/KPIs');
const TERM_CSV = path.join(DATA_DIR, 'PLN-01 term - Sheet1.csv');
const COURSE_TERM_CSV = path.join(DATA_DIR, 'PLN-01 Course-term - Sheet1.csv');
const SECTION_TERM_CSV = path.join(DATA_DIR, 'PLN-01 section-term - Sheet1.csv');

function parseCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, idx) => {
            const val = values[idx] ?? '';
            // Only parse as number if entire string is numeric (preserve "2019-20", "C00002", etc.)
            if (val !== '' && /^-?\d+\.?\d*$/.test(val)) {
                const num = parseFloat(val);
                row[h] = Number.isInteger(num) ? parseInt(val, 10) : num;
            } else {
                row[h] = val;
            }
        });
        rows.push(row);
    }
    return rows;
}

// Parse term-level data
const termData = parseCSV(fs.readFileSync(TERM_CSV, 'utf8'));
// Parse course-term data
const courseTermData = parseCSV(fs.readFileSync(COURSE_TERM_CSV, 'utf8'));
// Parse section-term data
const sectionTermData = parseCSV(fs.readFileSync(SECTION_TERM_CSV, 'utf8'));

// Normalize keys to camelCase for consistency (preserve original keys that have no underscore)
function toCamelKeys(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        const camel = k.replace(/_([a-zA-Z])/g, (_, c) => c.toUpperCase());
        out[camel] = v;
    }
    return out;
}

const termDataNormalized = termData.map(toCamelKeys);
const courseTermDataNormalized = courseTermData.map(toCamelKeys);
const sectionTermDataNormalized = sectionTermData.map(toCamelKeys);

// Write JSON files
fs.writeFileSync(
    path.join(DATA_DIR, 'PLN-01-term.json'),
    JSON.stringify(termDataNormalized, null, 2),
    'utf8'
);
fs.writeFileSync(
    path.join(DATA_DIR, 'PLN-01-course-term.json'),
    JSON.stringify(courseTermDataNormalized, null, 2),
    'utf8'
);
fs.writeFileSync(
    path.join(DATA_DIR, 'PLN-01-section-term.json'),
    JSON.stringify(sectionTermDataNormalized, null, 2),
    'utf8'
);

// Create PLN-01.json metadata (catalog + data references)
const PLN_01 = {
    id: "PLN-01",
    code: "PLN-01",
    name: "Optimum Class Size (Lecture)",
    category: "Normative",
    domain: "Section Planning",
    description: "Ideal enrollment for lecture section. Compare Enrolled_Count to target band for section planning and optimization.",
    formula: {
        description: "Compare Enrolled_Count to target band (20–30). Section is optimal when enrolled falls within band.",
        expression: "Enrolled_Count within [20, 30] → Optimal",
        components: [
            { name: "Enrolled_Count", key: "enrolledCount", description: "Number of students enrolled in the section", unit: "count" },
            { name: "Target Band", key: "targetBand", description: "Optimal range: 20–30 students (20/25/30 targets)", unit: "range" },
            { name: "Class Size Status", key: "classSizeStatus", description: "Underfilled | Optimal | Overfilled", unit: "label" }
        ]
    },
    unit: "Count (enrollment)",
    frequency: "Each Term",
    granularity: ["Section-Term", "Course-Term", "Term"],
    reportingPeriod: "Term",
    targets: {
        band: [20, 25, 30],
        range: "20–30",
        boardApproved: 25,
        stretch: 30,
        minimum: 20,
        description: "Best-practice example for lecture sections"
    },
    thresholds: {
        underfilled: { max: 19, label: "Underfilled - Below optimal band" },
        optimal: { min: 20, max: 30, label: "Optimal - Within target band" },
        overfilled: { min: 31, label: "Overfilled - Above optimal band" }
    },
    usage: {
        primary: "Section planning; optimization",
        secondary: [
            "Capacity planning",
            "Room allocation",
            "Faculty workload",
            "Schedule optimization"
        ],
        audience: ["Academic Affairs", "Registrar", "Department Chairs", "Scheduling"]
    },
    dataConnections: {
        tables: ["FACT_SECTION"],
        description: "Section-level enrollment and target band comparison"
    },
    dataFiles: {
        term: "PLN-01-term.json",
        courseTerm: "PLN-01-course-term.json",
        sectionTerm: "PLN-01-section-term.json"
    },
    dimensions: {
        time: ["Academic_Year", "Term"],
        organization: ["Course_ID", "Course_Title", "Section_ID"]
    },
    metrics: {
        primary: "pct_optimal",
        supporting: ["total_sections", "optimal_sections", "enrolledCount", "class_size_status"]
    },
    catalogMetadata: {
        source: "Best-practice example",
        granularityDetail: "Section; Course; Term",
        measureType: "Normative"
    }
};

fs.writeFileSync(
    path.join(DATA_DIR, 'PLN-01.json'),
    JSON.stringify(PLN_01, null, 2),
    'utf8'
);

// Create PLN-01.js module that exports the KPI with all data
const jsContent = `// PLN-01: Optimum Class Size (Lecture)
// Normative KPI - Ideal enrollment for lecture section (target band 20-30)
// Granularity: Section-Term; Course-Term; Term

const metadata = require('./PLN-01.json');
const termData = require('./PLN-01-term.json');
const courseTermData = require('./PLN-01-course-term.json');
const sectionTermData = require('./PLN-01-section-term.json');

const PLN_01 = {
  ...metadata,
  termData,
  courseTermData,
  sectionTermData,
};

module.exports = PLN_01;
module.exports.PLN_01 = PLN_01;
module.exports.default = PLN_01;
`;

fs.writeFileSync(path.join(DATA_DIR, 'PLN-01.js'), jsContent, 'utf8');

console.log('PLN-01 build complete:');
console.log('  - PLN-01-term.json:', termDataNormalized.length, 'rows');
console.log('  - PLN-01-course-term.json:', courseTermDataNormalized.length, 'rows');
console.log('  - PLN-01-section-term.json:', sectionTermDataNormalized.length, 'rows');
console.log('  - PLN-01.json (metadata)');
console.log('  - PLN-01.js (module)');
