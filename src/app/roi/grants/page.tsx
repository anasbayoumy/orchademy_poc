import ComingSoon from '@/components/ui/ComingSoon';

export default function GrantTracker() {
    return (
        <ComingSoon
            title="Work-Integrated Learning"
            description="Work placement and internship tracking coming soon"
            expectedKpis={[
                'Work Placement Participation Rate (OBEF)',
                'Job Offer Post Work-Placement (OBEF)',
                'Internship Participation Rate',
                'Internship-to-Job Conversion Rate',
                'Employer Satisfaction (Placements)',
            ]}
        />
    );
}
