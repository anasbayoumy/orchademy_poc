import ComingSoon from '@/components/ui/ComingSoon';

export default function SDGsCompliance() {
    return (
        <ComingSoon
            title="Energy & Carbon Economics"
            description="Sustainable Development Goals tracking coming soon"
            expectedKpis={[
                'Energy Cost per Student',
                'Energy Intensity (kWh per m²)',
                'Carbon Intensity (tCO₂ per revenue)',
                'Carbon Cost Exposure',
            ]}
        />
    );
}
