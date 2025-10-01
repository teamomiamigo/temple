import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IOSTile } from '../components/IOSTile';
import { colors, shadows } from '../constants/theme';
import { Template, useTemplateStore } from '../stores/templateStore';

type BodyScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const BodyScreen = ({ navigation }: BodyScreenProps) => {
  const templates = useTemplateStore(state => state.templates);
  const addTemplate = useTemplateStore(state => state.addTemplate);
  const updateTemplate = useTemplateStore(state => state.updateTemplate);
  const renderTemplateCard = (template: Template) => {
    return (
      <IOSTile
        key={template.id}
        style={styles.templateCard}
        onPress={() => {
          navigation.navigate('BuildTemplate', { templateId: template.id });
        }}
      >
        <View style={styles.templateCardHeader}>
          <Text style={styles.templateCardText}>{template.name}</Text>
          <View style={styles.templateBadge}>
            <Text style={styles.templateBadgeText}>{template.exercises.length}</Text>
          </View>
        </View>
        <Text style={styles.templateCardDetails}>
          {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.templateCardFooter}>
          <Text style={styles.templateCardTime}>Last used: Never</Text>
        </View>
      </IOSTile>
    );
  };

  const handleAddTemplatePress = () => {
    navigation.navigate('BuildTemplate');
  };

  const handleQuickWorkout = () => {
    navigation.navigate('QuickWorkout');
  };

  const handleLogRun = () => {
    navigation.navigate('RunLogging');
  };

  const handleStartWorkout = () => {
    // Navigate to workout session - could be template selection or quick start
    navigation.navigate('QuickWorkout');
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Let's Workout.</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.quickActionsGrid}>
            <IOSTile style={styles.quickActionCard} onPress={handleStartWorkout}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>🏋️</Text>
              </View>
              <Text style={styles.quickActionTitle}>Start Workout</Text>
              <Text style={styles.quickActionSubtitle}>Begin training</Text>
            </IOSTile>

            <IOSTile style={styles.quickActionCard} onPress={handleLogRun}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>🏃</Text>
              </View>
              <Text style={styles.quickActionTitle}>Log Run</Text>
              <Text style={styles.quickActionSubtitle}>Track your run</Text>
            </IOSTile>

            <IOSTile style={styles.quickActionCard} onPress={handleQuickWorkout}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>⚡</Text>
              </View>
              <Text style={styles.quickActionTitle}>Quick Log</Text>
              <Text style={styles.quickActionSubtitle}>Fast entry</Text>
            </IOSTile>

            <IOSTile style={styles.quickActionCard} onPress={handleAddTemplatePress}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>📝</Text>
              </View>
              <Text style={styles.quickActionTitle}>Create Template</Text>
              <Text style={styles.quickActionSubtitle}>Build routine</Text>
            </IOSTile>
          </View>
        </View>

        {/* Templates Section */}
        <View style={styles.templatesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Templates</Text>
            <IOSTile style={styles.addButton} onPress={handleAddTemplatePress}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </IOSTile>
          </View>

          {templates.length === 0 ? (
            <IOSTile style={styles.emptyState} onPress={handleAddTemplatePress}>
              <Text style={styles.emptyStateEmoji}>📋</Text>
              <Text style={styles.emptyStateTitle}>No templates yet</Text>
              <Text style={styles.emptyStateSubtitle}>Create your first workout template to get started</Text>
            </IOSTile>
          ) : (
            <View style={styles.templatesGrid}>
              {templates.map(renderTemplateCard)}
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <IOSTile style={styles.viewAllButton} onPress={() => {}}>
              <Text style={styles.viewAllButtonText}>View All</Text>
            </IOSTile>
          </View>

          <View style={styles.recentActivityList}>
            <View style={styles.recentActivityItem}>
              <View style={styles.recentActivityIcon}>
                <Text style={styles.recentActivityEmoji}>🏋️</Text>
              </View>
              <View style={styles.recentActivityContent}>
                <Text style={styles.recentActivityTitle}>Upper Body Strength</Text>
                <Text style={styles.recentActivitySubtitle}>Yesterday • 45 min</Text>
              </View>
              <View style={styles.recentActivityBadge}>
                <Text style={styles.recentActivityBadgeText}>Completed</Text>
              </View>
            </View>

            <View style={styles.recentActivityItem}>
              <View style={styles.recentActivityIcon}>
                <Text style={styles.recentActivityEmoji}>🏃</Text>
              </View>
              <View style={styles.recentActivityContent}>
                <Text style={styles.recentActivityTitle}>Morning Run</Text>
                <Text style={styles.recentActivitySubtitle}>2 days ago • 5.2 km</Text>
              </View>
              <View style={styles.recentActivityBadge}>
                <Text style={styles.recentActivityBadgeText}>Completed</Text>
              </View>
            </View>

            <View style={styles.recentActivityItem}>
              <View style={styles.recentActivityIcon}>
                <Text style={styles.recentActivityEmoji}>🧘</Text>
              </View>
              <View style={styles.recentActivityContent}>
                <Text style={styles.recentActivityTitle}>Yoga Flow</Text>
                <Text style={styles.recentActivitySubtitle}>3 days ago • 30 min</Text>
              </View>
              <View style={styles.recentActivityBadge}>
                <Text style={styles.recentActivityBadgeText}>Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>180</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>5.2</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 32 - 12) / 2;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  templatesSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...shadows.small,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    width: cardWidth,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  templateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  templateCardText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  templateBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  templateBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  templateCardDetails: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  templateCardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  templateCardTime: {
    color: colors.textMuted,
    fontSize: 12,
  },
  recentSection: {
    marginBottom: 32,
  },
  viewAllButton: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  viewAllButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  recentActivityList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recentActivityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentActivityEmoji: {
    fontSize: 18,
  },
  recentActivityContent: {
    flex: 1,
  },
  recentActivityTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentActivitySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  recentActivityBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recentActivityBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});