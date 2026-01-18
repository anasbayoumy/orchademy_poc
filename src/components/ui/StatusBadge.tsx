interface StatusBadgeProps {
    status: string;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const variantClasses: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-700',
};

// Auto-detect variant based on common status values
function getVariantFromStatus(status: string): string {
    const s = status.toLowerCase();
    if (['viable', 'balanced', 'on track', 'high', 'active', 'success'].includes(s)) {
        return 'success';
    }
    if (['marginal', 'at risk', 'medium', 'pending', 'warning'].includes(s)) {
        return 'warning';
    }
    if (['at-risk', 'overloaded', 'below target', 'low', 'danger', 'critical'].includes(s)) {
        return 'danger';
    }
    if (['underloaded', 'info', 'new'].includes(s)) {
        return 'info';
    }
    return 'neutral';
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
    const resolvedVariant = variant || getVariantFromStatus(status);

    return (
        <span className={`badge ${variantClasses[resolvedVariant]}`}>
            {status}
        </span>
    );
}
