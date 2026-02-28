import ComingSoon from '@/components/ui/ComingSoon';

export default function AcademicAdvising() {
    return (
        <ComingSoon
            title="Academic Progression & Advising Integrity"
            description="Advising effectiveness metrics coming soon"
            expectedKpis={[
                'Study Plan Adherence Rate',
                'Prerequisite Violation Rate',
                'Credit Completion Ratio',
                'Time to Degree',
                'Course Repeat Rate',
                'Bottleneck Course Index',
                'Curriculum Overcomplexity Index',
            ]}
        />
    );
}
