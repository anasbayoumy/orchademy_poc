// EFF-12: Student-to-Faculty Ratio (Actual)
// Actual ratio of active students to faculty FTE
// Formula: Active_Students ÷ Faculty_FTE (by unit and period)

const institutionData = require('./EFF-12-institution.json');
const collegeTermData = require('./EFF-12-college-term.json');
const collegeYearData = require('./EFF-12-college-year.json');
const departmentYearData = require('./EFF-12-department-year.json');

function getStatus(ratio, targetMax, watchThreshold) {
  const max = targetMax ?? 18;
  const watch = watchThreshold ?? 25;
  if (ratio <= max) return 'green';
  if (ratio <= watch) return 'amber';
  return 'red';
}

const targets = { min: 12, max: 18, watch: 25 };

const EFF_12 = {
  id: 'EFF-12',
  code: 'EFF-12',
  name: 'Student-to-Faculty Ratio (Actual)',
  category: 'Performance',
  description: 'Actual ratio of active students to faculty FTE. Measures instructional capacity and resource balance.',
  formula: {
    description: 'Active_Students ÷ Faculty_FTE (by unit and period)',
    components: [
      { name: 'Active_Students', description: 'From FACT_STUDENT_STATUS_HISTORY (Status=Active) aggregated' },
      { name: 'Faculty_FTE', description: 'From DIM_EMPLOYEE/FACT_EMPLOYEE_CTC filtered Employee_Type=Faculty, summed FTE' },
      { name: 'Ratio', formula: 'Active_Students ÷ Faculty_FTE' },
    ],
  },
  unit: ':1 ratio',
  frequency: 'Each Term; Annual',
  granularity: ['Institution', 'College', 'Program', 'Term', 'Academic Year'],
  targets: { min: 12, max: 18, watch: 25 },
  thresholds: {
    green: { label: 'Within target (≤18:1)' },
    amber: { label: 'Watch zone (18–25:1)' },
    red: { label: 'Above threshold (>25:1)' },
  },
  institutionData,
  collegeTermData,
  collegeYearData,
  departmentYearData,
  dataConnections: {
    tables: [
      'FACT_STUDENT_STATUS_HISTORY',
      'DIM_STUDENT',
      'DIM_PROGRAM',
      'DIM_TERM',
      'DIM_EMPLOYEE',
      'FACT_EMPLOYEE_CTC',
    ],
  },
  usage: {
    primary: 'Academic planning policy; staffing strategy',
    secondary: ['Capacity planning', 'Workload modeling', 'Section opening decisions', 'Hiring planning'],
  },
};

module.exports = EFF_12;
module.exports.EFF_12 = EFF_12;
