import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { IOSTile } from '../components/IOSTile';

type MindScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const MindScreen = ({ navigation }: MindScreenProps) => {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar' | 'media' | 'map'>('list');
  const [showJournalMenu, setShowJournalMenu] = useState(false);

  const journals = [
    { id: '1', name: 'Personal Journal', entries: 24 },
    { id: '2', name: 'Work Reflections', entries: 12 },
    { id: '3', name: 'Gratitude Log', entries: 8 },
    { id: '4', name: 'Dream Journal', entries: 5 },
  ];

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
        <IOSTile key={entry.id} style={styles.entryItem} onPress={() => navigation.navigate('JournalEntry')}>
          <View style={styles.entryDate}>
            <Text style={styles.entryDay}>{entry.day}</Text>
            <Text style={styles.entryDayNumber}>{entry.dayNumber}</Text>
          </View>
          <View style={styles.entryContent}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entryPreview}>{entry.preview}</Text>
            <Text style={styles.entryTime}>{entry.time}</Text>
          </View>
        </IOSTile>
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
        <IOSTile style={styles.menuButton} onPress={() => {}}>
          <Text style={styles.menuIcon}>☰</Text>
        </IOSTile>
        
        <IOSTile style={styles.headerTitle} onPress={() => setShowJournalMenu(true)}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.year}>2025</Text>
        </IOSTile>
        
        <View style={styles.headerActions}>
          <IOSTile style={styles.headerButton} onPress={() => {}}>
            <Text style={styles.headerIcon}>🔍</Text>
          </IOSTile>
          <IOSTile style={styles.headerButton} onPress={() => {}}>
            <Text style={styles.headerIcon}>💬</Text>
          </IOSTile>
          <IOSTile style={styles.profileButton} onPress={() => {}}>
            <Text style={styles.profileText}>NM</Text>
          </IOSTile>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <IOSTile 
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={styles.tabIcon}>📖</Text>
          <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>List</Text>
        </IOSTile>
        
        <IOSTile 
          style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={styles.tabIcon}>📅</Text>
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>Calendar</Text>
        </IOSTile>
        
        <IOSTile 
          style={[styles.tab, activeTab === 'media' && styles.tabActive]}
          onPress={() => setActiveTab('media')}
        >
          <Text style={styles.tabIcon}>📷</Text>
          <Text style={[styles.tabText, activeTab === 'media' && styles.tabTextActive]}>Media</Text>
        </IOSTile>
        
        <IOSTile 
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={styles.tabIcon}>🗺️</Text>
          <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>Map</Text>
        </IOSTile>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Floating Action Button */}
      <IOSTile 
        style={styles.fab}
        onPress={() => navigation.navigate('JournalEntry')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </IOSTile>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <IOSTile style={[styles.bottomNavItem, styles.bottomNavItemActive]} onPress={() => {}}>
          <Text style={[styles.bottomNavIcon, styles.bottomNavIconActive]}>📖</Text>
          <Text style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>Journals</Text>
        </IOSTile>
        
        <IOSTile 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Prompts')}
        >
          <Text style={styles.bottomNavIcon}>❓</Text>
          <Text style={styles.bottomNavLabel}>Prompts</Text>
        </IOSTile>
      </View>

      {/* Journal Menu Modal */}
      <Modal
        visible={showJournalMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowJournalMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.journalMenu}>
            <View style={styles.journalMenuHeader}>
              <Text style={styles.journalMenuTitle}>Journals</Text>
              <View style={styles.journalMenuActions}>
                <IOSTile style={styles.journalMenuButton} onPress={() => {}}>
                  <Text style={styles.journalMenuButtonText}>+</Text>
                </IOSTile>
                <IOSTile style={styles.journalMenuButton} onPress={() => {}}>
                  <Text style={styles.journalMenuButtonText}>✏️</Text>
                </IOSTile>
                <IOSTile style={styles.journalMenuButton} onPress={() => setShowJournalMenu(false)}>
                  <Text style={styles.journalMenuButtonText}>✕</Text>
                </IOSTile>
              </View>
            </View>
            
            <View style={styles.journalList}>
              {journals.map((journal) => (
                <IOSTile key={journal.id} style={styles.journalItem} onPress={() => setShowJournalMenu(false)}>
                  <View style={styles.journalItemContent}>
                    <Text style={styles.journalItemName}>{journal.name}</Text>
                    <Text style={styles.journalItemEntries}>{journal.entries} entries</Text>
                  </View>
                </IOSTile>
              ))}
            </View>
            
            <View style={styles.journalTrash}>
              <IOSTile style={styles.trashButton} onPress={() => {}}>
                <Text style={styles.trashIcon}>🗑️</Text>
                <Text style={styles.trashText}>Trash</Text>
              </IOSTile>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 8,
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
    paddingVertical: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    letterSpacing: 0.5,
  },
  entryDayNumber: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 24,
  },
  entryPreview: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
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
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomNavItemActive: {
    // No special styling for active state in this design
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#666',
  },
  bottomNavIconActive: {
    color: '#007AFF',
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  bottomNavLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  journalMenu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  journalMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  journalMenuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  journalMenuActions: {
    flexDirection: 'row',
    gap: 12,
  },
  journalMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalMenuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  journalList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  journalItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  journalItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  journalItemEntries: {
    fontSize: 14,
    color: '#666',
  },
  journalTrash: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  trashIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  trashText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});