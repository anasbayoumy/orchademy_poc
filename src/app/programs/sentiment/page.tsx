import ComingSoon from '@/components/ui/ComingSoon';

export default function LearningSentiment() {
    return (
        <ComingSoon
            title="Student Experience & Validation"
            description="Student feedback analysis coming soon"
            expectedKpis={[
                'Student Satisfaction with Learning Experience (OBEF)',
                'External Validation Rate (OBEF)',
            ]}
        />
    );
}
