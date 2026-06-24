import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, useWindowDimensions } from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { Task, Subtask, User } from "../models/types";
import {
  initDB,
  loginUser,
  getTasksByUser,
  addTaskDB,
  deleteTaskDB,
  toggleTaskCompleteDB,
  toggleSubtaskCompleteDB,
  updateTaskTitleNoteSubtasksDB,
  updateUserProfileDB,
} from "../utils/database";
import { seedDatabase } from "../utils/seedData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const AppContext = createContext<ReturnType<typeof useAppController> | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export function useAppController() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { colors } = useTheme();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App Navigation and Task State
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([
    "Work",
    "Study",
    "Personal",
    "Badminton 🏸",
  ]);

  // Sliding Animation Value (Auth panels)
  const animationValue = useRef(new Animated.Value(0)).current;

  // Animated value for bottom sheet slide-up
  const sheetAnim = useRef(new Animated.Value(0)).current;

  // Initialize SQLite database + seed sample data on mount
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        await seedDatabase(); // Insert sample data (skips if already exists)

        // Auto-login check
        const savedUsername = await AsyncStorage.getItem("saved_username");
        const savedPassword = await AsyncStorage.getItem("saved_password");
        const savedTimestamp = await AsyncStorage.getItem("saved_timestamp");

        if (savedUsername && savedPassword) {
          const currentTime = Date.now();
          const timestamp = savedTimestamp ? parseInt(savedTimestamp, 10) : 0;
          const tenMinutesInMs = 10 * 60 * 1000;

          if (currentTime - timestamp <= tenMinutesInMs) {
            const result = await loginUser(savedUsername, savedPassword);
            if (result.success && result.user) {
              setCurrentUser(result.user);
              setIsLoggedIn(true);
              await loadTasksFromDB(result.user.id);
              router.replace('/home' as any);
            }
          } else {
            // Session expired, clear stored credentials
            await AsyncStorage.removeItem("saved_username");
            await AsyncStorage.removeItem("saved_password");
            await AsyncStorage.removeItem("saved_timestamp");
          }
        }
      } catch (err) {
        console.error("Failed to initialize database or auto-login:", err);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isSignUp ? 1 : 0,
      duration: 450,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isSignUp, animationValue]);

  useEffect(() => {
    if (isCreateModalVisible) {
      sheetAnim.setValue(0);
      Animated.timing(sheetAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo
        useNativeDriver: true,
      }).start();
    }
  }, [isCreateModalVisible]);

  const handleCloseCreateModal = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 280,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start(() => {
      setIsCreateModalVisible(false);
    });
  };

  // Load tasks from SQLite when user logs in
  const loadTasksFromDB = async (userId: number) => {
    try {
      const dbTasks = await getTasksByUser(userId);
      setTasks(dbTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const refreshApp = async () => {
    if (!currentUser) return;
    setIsGlobalLoading(true);
    try {
      // Add a slight delay for better UX (so the spinner isn't just a flicker)
      await new Promise(resolve => setTimeout(resolve, 600));
      await loadTasksFromDB(currentUser.id);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const updateProfile = async (fullname: string, email: string) => {
    if (!currentUser) return { success: false, error: "Not logged in" };
    setIsGlobalLoading(true);
    try {
      const result = await updateUserProfileDB(currentUser.id, fullname, email);
      if (result.success) {
        setCurrentUser({ ...currentUser, fullname, email });
      }
      return result;
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const addTask = async (taskData: {
    title: string;
    tags: string[];
    priority: "High" | "Medium" | "Low";
    startDate?: Date;
    dueDate?: Date;
    note?: string;
    subtasks?: Subtask[];
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      createdAt: new Date(),
      tags: taskData.tags,
      priority: taskData.priority,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      note: taskData.note,
      subtasks: taskData.subtasks,
    };

    // Update UI immediately
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    handleCloseCreateModal();

    // Persist to SQLite
    if (currentUser) {
      try {
        await addTaskDB(currentUser.id, newTask);
      } catch (err) {
        console.error("Failed to save task to DB:", err);
      }
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;
    
    const subtask = task.subtasks.find((st) => st.id === subtaskId);
    if (!subtask) return;

    const newCompleted = !subtask.completed;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: newCompleted } : st
    );
    
    const allComplete = updatedSubtasks.every(st => st.completed);
    const needToChangeMainTask = task.completed !== allComplete;

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        return {
          ...t,
          completed: allComplete,
          subtasks: updatedSubtasks,
        };
      })
    );

    // Persist to SQLite
    try {
      await toggleSubtaskCompleteDB(subtaskId, newCompleted);
      if (needToChangeMainTask) {
        await toggleTaskCompleteDB(taskId, allComplete);
      }
    } catch (err) {
      console.error("Failed to toggle subtask in DB:", err);
    }
  };

  const backdropOpacity = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    // Load user's tasks from SQLite
    await loadTasksFromDB(user.id);
    router.replace('/home' as any);
  };

  const handleRegisterSuccess = (fullname: string) => {
    Alert.alert("Registration successful! 🎉", `Welcome, ${fullname}! Please login to continue.`);
    setIsSignUp(false);
  };

  const handleSocialLogin = (platform: string) => {
    Alert.alert(
      "Feature in Development",
      `Logging in with ${platform} is currently unavailable and under development. Please use a system account!`
    );
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    await AsyncStorage.removeItem("saved_username");
    await AsyncStorage.removeItem("saved_password");
    await AsyncStorage.removeItem("saved_timestamp");
    router.replace('/' as any);
  };

  // ===== Task operations exposed for TaskList (with DB persistence) =====

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: newCompleted } : t
      )
    );

    try {
      await toggleTaskCompleteDB(taskId, newCompleted);
    } catch (err) {
      console.error("Failed to toggle task in DB:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    try {
      await deleteTaskDB(taskId);
    } catch (err) {
      console.error("Failed to delete task from DB:", err);
    }
  };

  const handleSaveEdit = async (
    taskId: string,
    newTitle: string,
    newNote?: string,
    newSubtasks?: Task["subtasks"]
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: newTitle,
              note: newNote ? newNote.trim() : undefined,
              subtasks: newSubtasks,
            }
          : task
      )
    );

    try {
      await updateTaskTitleNoteSubtasksDB(taskId, newTitle, newNote, newSubtasks);
    } catch (err) {
      console.error("Failed to update task in DB:", err);
    }
  };

  // Auth Animations
  const brandTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 473],
  });

  const formTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -387],
  });

  const loginOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const loginTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const registerOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const registerTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return {
    isLargeScreen,
    colors,
    isLoggedIn,
    isSignUp,
    setIsSignUp,
    isGlobalLoading,
    refreshApp,
    updateProfile,
    currentUser,
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
    handleLoginSuccess,
    handleRegisterSuccess,
    handleSocialLogin,
    handleLogout,
    handleToggleComplete,
    handleDeleteTask,
    handleSaveEdit,
    brandTranslateX,
    formTranslateX,
    loginOpacity,
    loginTranslateY,
    registerOpacity,
    registerTranslateY,
  };
}
