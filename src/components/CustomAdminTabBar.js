import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const BUTTON_SIZE = 60;
const MARGIN = 6;

const CustomAdminTabBar = ({ state, descriptors, navigation }) => {
    const svgWidth = width - MARGIN * 2;
    const centerX = svgWidth / 2;
    const curveRadius = 50;

    return (
        <View style={styles.container}>
            <View style={styles.floatingWrapper}>
                {/* SVG con forma curva */}
                <Svg
                    width={svgWidth}
                    height={TAB_BAR_HEIGHT + 28}
                    style={styles.svg}
                >
                    <Path
                        d={`
            M 0,20
            L 0,${TAB_BAR_HEIGHT + 8}
            Q 0,${TAB_BAR_HEIGHT + 28} 20,${TAB_BAR_HEIGHT + 28}
            L ${svgWidth - 20},${TAB_BAR_HEIGHT + 28}
            Q ${svgWidth},${TAB_BAR_HEIGHT + 28} ${svgWidth},${TAB_BAR_HEIGHT + 8}
            L ${svgWidth},20
            Q ${svgWidth},0 ${svgWidth - 20},0
            L ${centerX + curveRadius + 10},0
            Q ${centerX + curveRadius},0 ${centerX + curveRadius - 5},5
            Q ${centerX + curveRadius - 10},10 ${centerX + curveRadius - 10},15
            C ${centerX + curveRadius - 10},${15 + BUTTON_SIZE / 2 - 10} ${centerX + BUTTON_SIZE / 2 + 5},${15 + BUTTON_SIZE / 2} ${centerX},${15 + BUTTON_SIZE / 2}
            C ${centerX - BUTTON_SIZE / 2 - 5},${15 + BUTTON_SIZE / 2} ${centerX - curveRadius + 10},${15 + BUTTON_SIZE / 2 - 10} ${centerX - curveRadius + 10},15
            Q ${centerX - curveRadius + 10},10 ${centerX - curveRadius + 5},5
            Q ${centerX - curveRadius},0 ${centerX - curveRadius - 10},0
            L 20,0
            Q 0,0 0,20
            Z
          `}
                        fill={COLORS.primary}
                    />
                </Svg>

                {/* Botón central flotante */}
                <TouchableOpacity
                    style={styles.centerButton}
                    onPress={() => navigation.navigate('Pedidos')}
                    activeOpacity={0.8}
                >
                    <View style={styles.centerButtonInner}>
                        <Icon name="file-text-o" size={32} color={COLORS.white} />
                    </View>
                </TouchableOpacity>

                {/* Iconos de navegación */}
                <View style={styles.tabsContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        // Saltar el tab central (Pedidos) ya que usamos el botón flotante
                        if (route.name === 'Pedidos') {
                            return <View key={route.key} style={styles.tabItem} />;
                        }

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        let iconName;
                        if (route.name === 'Inicio') iconName = 'home';
                        else if (route.name === 'Shorts') iconName = 'play-circle';
                        else if (route.name === 'Productos') iconName = 'cutlery';
                        else if (route.name === 'Ajustes') iconName = 'cog';

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                style={styles.tabItem}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                                    <Icon
                                        name={iconName}
                                        size={30}
                                        color={COLORS.white}
                                    />
                                    {isFocused && <View style={styles.activeDot} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 6,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT + 30,
        paddingHorizontal: MARGIN,
    },
    floatingWrapper: {
        flex: 1,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 20,
    },
    svg: {
        position: 'absolute',
        bottom: 2,
        left: 0,
    },
    tabsContainer: {
        flexDirection: 'row',
        height: TAB_BAR_HEIGHT,
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingTop: 30,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    iconContainerActive: {
        position: 'relative',
    },
    activeDot: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.white,
    },
    centerButton: {
        position: 'absolute',
        top: -20,
        left: (width - MARGIN * 2) / 2 - BUTTON_SIZE / 2,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 20,
        zIndex: 100,
    },
    centerButtonInner: {
        width: BUTTON_SIZE - 6,
        height: BUTTON_SIZE - 6,
        borderRadius: (BUTTON_SIZE - 6) / 2,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});

export default CustomAdminTabBar;
