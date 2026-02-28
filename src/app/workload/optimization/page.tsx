import ComingSoon from '@/components/ui/ComingSoon';

export default function LoadOptimization() {
    return (
        <ComingSoon
            title="Section Utilization & Stability"
            description="Workload optimization tools coming soon"
            expectedKpis={[
                'Section Utilization Rate',
                'Cancelled Section Ratio',
                'Minimum Enrollment to Run Section',
                'Section Cancellation Threshold',
                'Target Section Fill Rate',
                'Overfilled Section Threshold',
            ]}
        />
    );
}
