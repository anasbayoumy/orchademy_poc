import employabilityData from './json/employability.json';

export interface EmployabilityMetric {
    [key: string]: unknown;
    programId: string;
    programName: string;
    department: string;
    employmentRate: number;
    avgTimeToEmployment: number;
    avgStartingSalary: number;
    employerSatisfaction: number;
    skillsMatch: number;
    graduateCount: number;
    topEmployers: string[];
}

export interface SkillAlignment {
    skill: string;
    curriculumCoverage: number;
    marketDemand: 'High' | 'Medium' | 'Low';
    gap: number;
    programs: string[];
}

export interface EmployerFeedback {
    employer: string;
    industry: string;
    satisfactionScore: number;
    hiresCount: number;
    strengthAreas: string[];
    improvementAreas: string[];
}

export interface ImpactMetric {
    label: string;
    value: string;
    change: number;
    changeLabel: string;
}

export const EMPLOYABILITY_DATA: EmployabilityMetric[] = employabilityData as EmployabilityMetric[];

export function getSkillAlignmentData(): SkillAlignment[] {
    return [
        { skill: 'Python Programming', curriculumCoverage: 85, marketDemand: 'High', gap: 5, programs: ['Computer Science', 'Data Science'] },
        { skill: 'Machine Learning', curriculumCoverage: 70, marketDemand: 'High', gap: -15, programs: ['Data Science', 'AI & ML'] },
        { skill: 'Cloud Computing', curriculumCoverage: 55, marketDemand: 'High', gap: -25, programs: ['Computer Science', 'Software Engineering'] },
        { skill: 'Data Analysis', curriculumCoverage: 80, marketDemand: 'High', gap: 0, programs: ['Data Science', 'Business'] },
        { skill: 'Project Management', curriculumCoverage: 75, marketDemand: 'Medium', gap: 10, programs: ['MBA', 'Business Administration'] },
        { skill: 'Communication', curriculumCoverage: 90, marketDemand: 'High', gap: 15, programs: ['All Programs'] },
        { skill: 'Critical Thinking', curriculumCoverage: 88, marketDemand: 'Medium', gap: 18, programs: ['All Programs'] },
        { skill: 'Cybersecurity', curriculumCoverage: 65, marketDemand: 'High', gap: -10, programs: ['Cybersecurity', 'Computer Science'] },
    ];
}

export function getEmployerFeedback(): EmployerFeedback[] {
    return [
        {
            employer: 'Google',
            industry: 'Technology',
            satisfactionScore: 4.7,
            hiresCount: 45,
            strengthAreas: ['Technical Skills', 'Problem Solving'],
            improvementAreas: ['System Design', 'Leadership'],
        },
        {
            employer: 'Microsoft',
            industry: 'Technology',
            satisfactionScore: 4.5,
            hiresCount: 38,
            strengthAreas: ['Coding Skills', 'Teamwork'],
            improvementAreas: ['Cloud Experience', 'Agile'],
        },
        {
            employer: 'JPMorgan Chase',
            industry: 'Finance',
            satisfactionScore: 4.3,
            hiresCount: 62,
            strengthAreas: ['Analytical Skills', 'Professionalism'],
            improvementAreas: ['Financial Modeling', 'Risk Analysis'],
        },
        {
            employer: 'Mayo Clinic',
            industry: 'Healthcare',
            satisfactionScore: 4.6,
            hiresCount: 85,
            strengthAreas: ['Clinical Skills', 'Empathy'],
            improvementAreas: ['EHR Systems', 'Time Management'],
        },
        {
            employer: 'Deloitte',
            industry: 'Consulting',
            satisfactionScore: 4.2,
            hiresCount: 52,
            strengthAreas: ['Communication', 'Adaptability'],
            improvementAreas: ['Client Management', 'Industry Knowledge'],
        },
        {
            employer: 'Tesla',
            industry: 'Manufacturing',
            satisfactionScore: 4.4,
            hiresCount: 28,
            strengthAreas: ['Engineering Skills', 'Innovation'],
            improvementAreas: ['Manufacturing Processes', 'CAD Tools'],
        },
    ];
}

export function getImpactMetrics(): ImpactMetric[] {
    const avgEmploymentRate = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employmentRate, 0) / EMPLOYABILITY_DATA.length;
    const avgSalary = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.avgStartingSalary, 0) / EMPLOYABILITY_DATA.length;
    const totalGraduates = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.graduateCount, 0);

    return [
        { label: 'Employment Rate', value: `${avgEmploymentRate.toFixed(0)}%`, change: 4, changeLabel: 'YoY' },
        { label: 'Avg Salary', value: `$${(avgSalary / 1000).toFixed(0)}K`, change: 8, changeLabel: 'YoY' },
        { label: 'Graduates', value: totalGraduates.toString(), change: 12, changeLabel: 'YoY' },
        { label: 'Top Employers', value: '45', change: 5, changeLabel: 'new' },
        { label: 'Avg Time to Employ', value: '2.8 mo', change: -15, changeLabel: 'faster' },
        { label: 'Skills Match', value: '82%', change: 6, changeLabel: 'improved' },
    ];
}
