import ComingSoon from '@/components/ui/ComingSoon';

export default function DemandSupply() {
    return (
        <ComingSoon
            title="Program Demand & Viability"
            description="Market demand analysis coming soon"
            expectedKpis={[
                'Program Demand Trend',
                'Yield Rate',
                'Faculty Credential Gap Count',
                'Minimum Cohort to Launch New Program',
                'Program Viability Threshold (Active Students)',
                'Minimum Graduates per Year',
            ]}
        />
    );
}
