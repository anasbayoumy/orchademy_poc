import ComingSoon from '@/components/ui/ComingSoon';

export default function ResourceUtilization() {
    return (
        <ComingSoon
            title="Productivity & Revenue Efficiency"
            description="Resource efficiency tracking coming soon"
            expectedKpis={[
                'Faculty Productivity Index (SCH per Faculty FTE)',
                'Revenue per Faculty FTE',
            ]}
        />
    );
}
