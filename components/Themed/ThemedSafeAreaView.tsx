import { SafeAreaView, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedSafeAreaViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
