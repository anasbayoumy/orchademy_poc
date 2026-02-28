import ComingSoon from '@/components/ui/ComingSoon';

export default function PrioritiesIntegration() {
    return (
        <ComingSoon
            title="Execution Discipline"
            description="Priority management and execution discipline tracking coming soon"
            expectedKpis={[
                'Initiative Delivery Rate',
                'On-Time Milestone Rate',
                'KPI Health Rate',
                'Over-Initiation Index',
            ]}
        />
    );
}
