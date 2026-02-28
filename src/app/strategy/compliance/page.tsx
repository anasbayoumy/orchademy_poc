import ComingSoon from '@/components/ui/ComingSoon';

export default function ComplianceMonitor() {
    return (
        <ComingSoon
            title="Compliance & External Signals"
            description="Compliance tracking system coming soon"
            expectedKpis={[
                'International Accreditation Status (OBEF)',
                'Community Engagement Events (OBEF)',
            ]}
        />
    );
}
