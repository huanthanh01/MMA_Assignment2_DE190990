import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../components/styles/index.styles";

import { Dashboard } from "../components/Dashboard";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { TaskInput } from "../components/TaskInput";
import { useAppContext } from "../controllers/useAppController";

export default function HomeScreen() {
  const {
    isLargeScreen,
    colors,
    currentUser,
    isGlobalLoading,
    refreshApp,
    isCreateModalVisible,
    setIsCreateModalVisible,
    isSidebarVisible,
    setIsSidebarVisible,
    tasks,
    setTasks,
    suggestedTags,
    setSuggestedTags,
    addTask,
    toggleSubtask,
    handleCloseCreateModal,
    backdropOpacity,
    sheetTranslateY,
    handleLogout,
    handleToggleComplete,
    handleDeleteTask,
    handleSaveEdit,
  } = useAppContext();

  return (
    <SafeAreaView
      style={[styles.homeContainer, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={colors.statusBar} />
      <Header
        isLargeScreen={isLargeScreen}
        onLogout={handleLogout}
        onOpenSidebar={() => setIsSidebarVisible(true)}
        onReload={refreshApp}
      />

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Dashboard
            tasks={tasks}
            setTasks={setTasks}
            onNavigateToCreate={() => setIsCreateModalVisible(true)}
            onToggleSubtask={toggleSubtask}
            currentUser={currentUser}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onSaveEdit={handleSaveEdit}
          />
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={isCreateModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseCreateModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            {/* Backdrop */}
            <Animated.View
              style={[
                styles.modalOverlay,
                isLargeScreen && styles.modalOverlayLarge,
                {
                  opacity: backdropOpacity,
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={handleCloseCreateModal}
              />
            </Animated.View>

            {/* Content Sheet */}
            <Animated.View
              style={[
                styles.modalContent,
                isLargeScreen && styles.modalContentLarge,
                {
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
            >
              <View style={styles.modalHeaderBar} />
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <TaskInput
                  onAddTask={addTask}
                  suggestedTags={suggestedTags}
                  setSuggestedTags={setSuggestedTags}
                  onClose={handleCloseCreateModal}
                />
              </ScrollView>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Global Loading Overlay */}
      {isGlobalLoading && (
        <View style={[styles.modalOverlay, { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center", zIndex: 999 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
