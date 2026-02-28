import ComingSoon from '@/components/ui/ComingSoon';

export default function MissionScorecard() {
    return (
        <ComingSoon
            title="Strategy Economics & Risk"
            description="Mission alignment scorecard coming soon"
            expectedKpis={[
                'Strategic Spend Alignment',
                'Risk Exposure Index',
            ]}
        />
    );
}
