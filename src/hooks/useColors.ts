'use client';

import { useTheme } from '@/context/ThemeContext';
import { getThemeColors } from '@/config/design-tokens';

export function useColors() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return getThemeColors(isDark);
}
