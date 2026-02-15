#!/usr/bin/env node
/**
 * Build API-06-program-term.json and API-06-college-term.json
 * Program-term: derived from user's P015 2023-24 Spring data (35 students, 14 flagged = 40%)
 * College-term: aggregate mock
 */
const fs = require('fs');
const path = require('path');

const ROI03 = require('../src/data/KPIs/ROI-03-program-term.json');

// P015 2023-24 Spring: 35 students, 14 flagged (Critical+High+Moderate) = 40%
const P015_SPRING_202324 = { totalActiveStudents: 35, flaggedStudents: 14, atRiskRate: 40 };

function getStatus(atRiskRate) {
  if (atRiskRate < 8) return 'green';
  if (atRiskRate >= 25) return 'red';
  return 'amber';
}

// Deterministic mock based on programId + term + year
function mockProgramTerm(row) {
  const key = `${row.programId}-${row.term}-${row.academicYear}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;

  if (row.programId === 'P015' && row.term === 'Spring' && row.academicYear === '2023-24') {
    return {
      academicYear: row.academicYear,
      term: row.term,
      college: row.college,
      programId: row.programId,
      programName: row.programName,
      totalActiveStudents: P015_SPRING_202324.totalActiveStudents,
      flaggedStudents: P015_SPRING_202324.flaggedStudents,
      atRiskRate: P015_SPRING_202324.atRiskRate,
      status: getStatus(P015_SPRING_202324.atRiskRate),
    };
  }

  const baseStudents = 25 + (h % 45);
  const ratePct = 4 + (h % 42);
  const flagged = Math.round((baseStudents * ratePct) / 100);
  const atRiskRate = Math.round((flagged / baseStudents) * 1000) / 10;

  return {
    academicYear: row.academicYear,
    term: row.term,
    college: row.college,
    programId: row.programId,
    programName: row.programName,
    totalActiveStudents: baseStudents,
    flaggedStudents: flagged,
    atRiskRate,
    status: getStatus(atRiskRate),
  };
}

const programTermData = ROI03.map(mockProgramTerm);

// College-term: aggregate by college + academicYear + term
const collegeTermMap = {};
programTermData.forEach((row) => {
  const k = `${row.college}|${row.academicYear}|${row.term}`;
  if (!collegeTermMap[k]) {
    collegeTermMap[k] = { college: row.college, academicYear: row.academicYear, term: row.term, totalActiveStudents: 0, flaggedStudents: 0 };
  }
  collegeTermMap[k].totalActiveStudents += row.totalActiveStudents;
  collegeTermMap[k].flaggedStudents += row.flaggedStudents;
});

const collegeTermData = Object.values(collegeTermMap).map((r) => {
  const atRiskRate = r.totalActiveStudents > 0 ? Math.round((r.flaggedStudents / r.totalActiveStudents) * 1000) / 10 : 0;
  return {
    academicYear: r.academicYear,
    term: r.term,
    college: r.college,
    totalActiveStudents: r.totalActiveStudents,
    flaggedStudents: r.flaggedStudents,
    atRiskRate,
    status: getStatus(atRiskRate),
  };
});

const outDir = path.join(__dirname, '../src/data/KPIs');
fs.writeFileSync(path.join(outDir, 'API-06-program-term.json'), JSON.stringify(programTermData, null, 2));
fs.writeFileSync(path.join(outDir, 'API-06-college-term.json'), JSON.stringify(collegeTermData, null, 2));
console.log('API-06-program-term.json:', programTermData.length, 'rows');
console.log('API-06-college-term.json:', collegeTermData.length, 'rows');
console.log('P015 2023-24 Spring:', programTermData.find((r) => r.programId === 'P015' && r.term === 'Spring' && r.academicYear === '2023-24'));
