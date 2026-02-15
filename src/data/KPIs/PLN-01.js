// PLN-01: Optimum Class Size (Lecture)
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
