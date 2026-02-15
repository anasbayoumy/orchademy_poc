// API-06: At-Risk Student Rate
// % students flagged as at-risk (GPA, DFW, velocity, repeats, withdrawals)
// Formula: Flagged students ÷ total active students
// Granularity: Program-Term; College-Term

const metadata = require('./API-06.json');
const programTermData = require('./API-06-program-term.json');
const collegeTermData = require('./API-06-college-term.json');

const API_06 = {
  ...metadata,
  programTermData,
  collegeTermData,
};

module.exports = API_06;
module.exports.API_06 = API_06;
