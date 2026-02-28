// OBF-01: Employment Rate (OBEF)
// OBEF-defined employment rate within 1 year
// Formula: (Employed or further study) ÷ graduates (OBEF definition)

const institutionYearData = require('./OBF-01-institution-year.json');
const programData = require('./OBF-01-program.json');

function getStatus(pct, targetPct) {
  if (pct >= targetPct) return 'green';
  if (pct >= targetPct - 5) return 'amber';
  return 'red';
}

const targetPct = 70;
const institutionYearWithStatus = institutionYearData.map((d) => ({
  ...d,
  status: getStatus(d.employmentRate1YPct, d.targetPct ?? targetPct),
}));

const programDataWithStatus = programData.map((d) => ({
  ...d,
  status: getStatus(d.employmentRate1YPct, d.targetPct ?? targetPct),
}));

const latestInstitution = institutionYearData[institutionYearData.length - 1] || {};
const institutionalMetrics = {
  totalGraduates: latestInstitution.totalGraduates ?? 0,
  employedWithin1Year: latestInstitution.employedWithin1Year ?? 0,
  furtherStudyWithin1Year: latestInstitution.furtherStudyWithin1Year ?? 0,
  successfulOutcomesTotal: latestInstitution.successfulOutcomesTotal ?? 0,
  employmentRate1YPct: latestInstitution.employmentRate1YPct ?? 0,
  targetPct,
  status: getStatus(latestInstitution.employmentRate1YPct ?? 0, targetPct),
};

const OBF_01 = {
  id: 'OBF-01',
  code: 'OBF-01',
  name: 'Employment Rate (OBEF)',
  category: 'Compliance',
  description: 'OBEF-defined employment rate within 1 year. (Employed or further study) ÷ graduates.',
  formula: {
    description: '(Employed or further study) ÷ graduates (OBEF definition)',
    components: [
      { name: 'Total Graduates', description: 'Total graduates in cohort' },
      { name: 'Employed Within 1 Year', description: 'Graduates employed within 12 months' },
      { name: 'Further Study Within 1 Year', description: 'Graduates in further study within 12 months' },
      { name: 'Successful Outcomes Total', description: 'Employed + Further Study' },
      { name: 'Employment Rate', formula: '(Successful Outcomes ÷ Total Graduates) × 100' },
    ],
  },
  unit: '%',
  frequency: 'Annual',
  granularity: ['Institution', 'Program'],
  targets: { minPct: 70 },
  thresholds: {
    green: { label: 'At or above target (≥70%)' },
    amber: { label: 'Within 5% of target (65–70%)' },
    red: { label: 'Below 65%' },
  },
  institutionYearData: institutionYearWithStatus,
  programData: programDataWithStatus,
  institutionalMetrics,
  dataConnections: {
    tables: [
      'FACT_DEGREE_AUDIT',
      'FACT_EMPLOYMENT_OUTCOMES',
      'FACT_INTERNSHIPS',
      'FACT_EMPLOYER_FEEDBACK',
      'FACT_ALUMNI_OUTCOMES',
    ],
  },
  usage: {
    primary: 'OBEF reporting, compliance pillar 1',
    secondary: ['Employability dashboards', 'Program outcome benchmarking', 'Accreditation evidence'],
  },
};

module.exports = OBF_01;
module.exports.OBF_01 = OBF_01;
