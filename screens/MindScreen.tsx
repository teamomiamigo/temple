import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MindScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const MindScreen = ({ navigation }: MindScreenProps) => {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar' | 'media' | 'map'>('list');

  const journalEntries = [
    {
      id: '1',
      date: '2025-01-15',
      day: 'WED',
      dayNumber: '15',
      title: 'Reflecting on today',
      preview: 'Had a great day today. Feeling grateful for the small moments and the people in my life...',
      time: '8:30 PM',
    },
    {
      id: '2',
      date: '2025-01-14',
      day: 'TUE',
      dayNumber: '14',
      title: 'Mindful morning',
      preview: 'Started the day with meditation and it really set the tone for everything else...',
      time: '7:15 AM',
    },
    {
      id: '3',
      date: '2025-01-13',
      day: 'MON',
      dayNumber: '13',
      title: 'Weekend thoughts',
      preview: 'Spent time thinking about my goals and what I want to focus on this week...',
      time: '9:45 PM',
    },
  ];

  const renderListTab = () => (
    <View style={styles.contentArea}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>January 2025</Text>
      </View>
      
      {journalEntries.map((entry) => (
        <TouchableOpacity key={entry.id} style={styles.entryItem}>
          <View style={styles.entryDate}>
            <Text style={styles.entryDay}>{entry.day}</Text>
            <Text style={styles.entryDayNumber}>{entry.dayNumber}</Text>
          </View>
          <View style={styles.entryContent}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entryPreview}>{entry.preview}</Text>
            <Text style={styles.entryTime}>{entry.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCalendarTab = () => (
    <View style={styles.contentArea}>
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarMonth}>January 2025</Text>
        </View>
        
        <View style={styles.calendarGrid}>
          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar days */}
          <View style={styles.calendarDays}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity key={day} style={styles.calendarDay}>
                <Text style={[
                  styles.calendarDayText,
                  day === 15 && styles.calendarDaySelected
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderMediaTab = () => (
    <View style={styles.contentArea}>
      <View style={styles.mediaFilters}>
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={[styles.filterTabText, styles.filterTabTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>PDF</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>Media Timeline</Text>
        <Text style={styles.emptyStateSubtitle}>
          Photo, video, audio, and PDF files will appear here when added to your journal
        </Text>
      </View>
    </View>
  );

  const renderMapTab = () => (
    <View style={styles.contentArea}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>Map View</Text>
        <Text style={styles.emptyStateSubtitle}>
          Journal entries with location data will appear here
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return renderListTab();
      case 'calendar':
        return renderCalendarTab();
      case 'media':
        return renderMediaTab();
      case 'map':
        return renderMapTab();
      default:
        return renderListTab();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.year}>2025</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>NM</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={styles.tabIcon}>📖</Text>
          <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>List</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'media' && styles.tabActive]}
          onPress={() => setActiveTab('media')}
        >
          <Text style={[styles.tabText, activeTab === 'media' && styles.tabTextActive]}>Media</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('JournalEntry')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>📖</Text>
          <Text style={styles.bottomNavLabel}>Journals</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Prompts')}
        >
          <Text style={styles.bottomNavIcon}>❓</Text>
          <Text style={styles.bottomNavLabel}>Prompts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>⋯</Text>
          <Text style={styles.bottomNavLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  year: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    color: '#fff',
    fontSize: 18,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  entryItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  entryDate: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  entryDay: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  entryDayNumber: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 2,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 14,
    color: '#999',
  },
  calendarContainer: {
    padding: 20,
  },
  calendarHeader: {
    marginBottom: 20,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarGrid: {
    backgroundColor: '#fff',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    paddingVertical: 8,
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: width / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  calendarDaySelected: {
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  mediaFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#666',
  },
});