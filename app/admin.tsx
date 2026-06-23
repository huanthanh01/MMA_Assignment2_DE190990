import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppContext } from "../controllers/useAppController";
import { useTheme } from "../constants/ThemeContext";
import { User } from "../models/types";
import { getAllUsersDB, getAllTasksCountDB, deleteUserDB, clearAllDataDB } from "../utils/database";

export default function AdminScreen() {
  const { currentUser, isLargeScreen } = useAppContext();
  const { colors, isDark } = useTheme();
  
  const [users, setUsers] = useState<User[]>([]);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"users" | "database">("users");

  // Protect route
  useEffect(() => {
    if (!currentUser || currentUser.username !== 'admin') {
      Alert.alert("Access Denied", "You do not have permission to view this page.");
      router.replace('/home');
    } else {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsersDB();
      const count = await getAllTasksCountDB();
      setUsers(fetchedUsers);
      setTaskCount(count);
    } catch (error) {
      console.error("Error loading admin data:", error);
      Alert.alert("Error", "Failed to load database data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: number, username: string) => {
    if (username === 'admin') {
      Alert.alert("Action Not Allowed", "You cannot delete the admin account.");
      return;
    }

    Alert.alert(
      "Delete User",
      `Are you sure you want to delete user '${username}'? This will also delete all their tasks and subtasks forever.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserDB(userId);
              loadData(); // Refresh list
            } catch (error) {
              console.error("Delete user error:", error);
              Alert.alert("Error", "Failed to delete user.");
            }
          }
        }
      ]
    );
  };

  const handleWipeData = () => {
    Alert.alert(
      "DANGER ZONE: Wipe All Data",
      "This will PERMANENTLY erase all users, tasks, and subtasks. You will be logged out. Are you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "YES, WIPE EVERYTHING", 
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllDataDB();
              Alert.alert("Success", "All data has been wiped.", [
                {
                  text: "OK",
                  onPress: () => {
                    // Force app reload or log out by going to index
                    router.replace("/");
                  }
                }
              ]);
            } catch (error) {
              console.error("Wipe data error:", error);
              Alert.alert("Error", "Failed to wipe data.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Panel</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'users' ? colors.primary : colors.textSecondary }]}>Users ({users.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'database' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('database')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'database' ? colors.primary : colors.textSecondary }]}>Database</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'users' ? (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>All Registered Users</Text>
            {users.map(user => (
              <View key={user.id} style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.fullname} (@{user.username})</Text>
                  <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                  <Text style={[styles.userId, { color: colors.textSecondary }]}>ID: {user.id}</Text>
                </View>
                {user.username !== 'admin' && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(user.id, user.username)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {users.length === 0 && (
              <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No users found.</Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Database Statistics</Text>
            
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Total Users:</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>{users.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Total Tasks:</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>{taskCount}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 30 }]}>Danger Zone</Text>
            <View style={[styles.dangerCard, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)', borderColor: '#ef4444' }]}>
              <Text style={[styles.dangerText, { color: colors.text }]}>
                Wiping data will delete all rows from users, tasks, and subtasks tables. This action is irreversible.
              </Text>
              <TouchableOpacity style={styles.wipeButton} onPress={handleWipeData}>
                <Ionicons name="warning-outline" size={20} color="#fff" />
                <Text style={styles.wipeButtonText}>WIPE ALL DATA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  refreshButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
  },
  statCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dangerCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
  },
  dangerText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  wipeButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
  },
  wipeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
});
