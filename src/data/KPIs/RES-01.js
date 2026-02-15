// RES-01: Publications per FTE (Research Productivity)
// Research productivity normalized by faculty FTE
// Formula: Publications ÷ faculty FTE (annual)
// Granularity: College-Year; Department-Year

const metadata = require("./RES-01.json");
const collegeYearData = require("./RES-01-college-year.json");
const departmentYearData = require("./RES-01-department-year.json");

const targets = metadata.targets;
const thresholds = metadata.thresholds;

function getStatus(pubPerFte) {
  if (pubPerFte >= (thresholds.green.min ?? 1.2)) return "green";
  if (pubPerFte < (thresholds.red.max ?? 0.5)) return "red";
  return "amber";
}

const collegeYearDataWithStatus = collegeYearData.map((d) => ({
  ...d,
  status: getStatus(d.publications_per_fte),
}));

const departmentYearDataWithStatus = departmentYearData.map((d) => ({
  ...d,
  status: getStatus(d.publications_per_fte),
}));

const byYear = collegeYearData.reduce((acc, d) => {
  if (!acc[d.academicYear]) acc[d.academicYear] = { total_publications: 0, total_fte: 0 };
  acc[d.academicYear].total_publications += d.total_publications;
  acc[d.academicYear].total_fte += d.total_fte;
  return acc;
}, {});
const latestYear = Object.keys(byYear).sort().pop() || "2023-24";
const instMetrics = byYear[latestYear];
const institutionalPublicationsPerFte =
  instMetrics?.total_fte > 0
    ? instMetrics.total_publications / instMetrics.total_fte
    : 0;

const RES_01 = {
  ...metadata,
  collegeYearData: collegeYearDataWithStatus,
  departmentYearData: departmentYearDataWithStatus,
  institutionalMetrics: {
    totalPublications: instMetrics?.total_publications ?? 0,
    totalFte: instMetrics?.total_fte ?? 0,
    publicationsPerFte: institutionalPublicationsPerFte,
    status: getStatus(institutionalPublicationsPerFte),
    latestYear,
  },
};

module.exports = RES_01;
module.exports.RES_01 = RES_01;
