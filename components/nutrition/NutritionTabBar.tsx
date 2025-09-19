import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getPlatformColor } from '../../utils/platformColors';

interface NutritionTabBarProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export const NutritionTabBar: React.FC<NutritionTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const activeIndex = tabs.indexOf(activeTab);

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: activeIndex,
      tension: 300,
      friction: 30,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicatorAnim]);

  const handleTabPress = (tab: string) => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
    onChange(tab);
  };

  const tabWidth = 100 / tabs.length;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { width: `${tabWidth}%` }]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${tabWidth}%`,
              transform: [
                {
                  translateX: indicatorAnim.interpolate({
                    inputRange: [0, tabs.length - 1],
                    outputRange: [0, (tabs.length - 1) * 100],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: getPlatformColor('systemGray6'),
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
  activeTabText: {
    color: getPlatformColor('label'),
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: getPlatformColor('systemBackground'),
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

