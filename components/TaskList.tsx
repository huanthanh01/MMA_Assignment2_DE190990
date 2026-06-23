import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { Task } from "../models/types";
import { Dropdown } from "./Dropdown";
import { SearchBar } from "./SearchBar";
import { styles } from "./styles/TaskList.styles";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onNavigateToCreate?: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onToggleComplete?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onSaveEdit?: (
    id: string,
    newTitle: string,
    newNote?: string,
    newSubtasks?: Task["subtasks"],
  ) => void;
  ListHeaderComponent?: React.ReactElement;
}

type FilterType = "All" | "Completed" | "Incomplete" | "Overdue";
export type SortType =
  | "newest"
  | "oldest"
  | "priority"
  | "dueDate"
  | "alphabet";

const STATUS_OPTIONS: { id: FilterType; label: string }[] = [
  { id: "All", label: "All Status" },
  { id: "Incomplete", label: "Pending ⏰" },
  { id: "Completed", label: "Completed ✅" },
  { id: "Overdue", label: "Overdue ⚠️" },
];

const SORT_OPTIONS: { id: SortType; label: string }[] = [
  { id: "newest", label: "Newest 🕒" },
  { id: "oldest", label: "Oldest ⏳" },
  { id: "priority", label: "Priority 🔥" },
  { id: "dueDate", label: "Deadline ⏰" },
  { id: "alphabet", label: "Name (A-Z) 🔤" },
];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  onNavigateToCreate,
  onToggleSubtask,
  onToggleComplete: onToggleCompleteProp,
  onDeleteTask: onDeleteTaskProp,
  onSaveEdit: onSaveEditProp,
  ListHeaderComponent,
}) => {
  const { colors } = useTheme();

  // Filter and Sorting States
  const [filter, setFilter] = useState<FilterType>("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [activeDropdown, setActiveDropdown] = useState<
    "status" | "tag" | "sort" | null
  >(null);

  // Reset tagFilter to All if the selected tag no longer exists in tasks
  const uniqueTags = React.useMemo(() => {
    return Array.from(new Set(tasks.flatMap((t) => t.tags || [])));
  }, [tasks]);

  React.useEffect(() => {
    if (tagFilter !== "All" && !uniqueTags.includes(tagFilter)) {
      setTagFilter("All");
    }
  }, [tagFilter, uniqueTags]);

  // Task Actions
  const toggleComplete = React.useCallback(
    (id: string) => {
      if (onToggleCompleteProp) {
        onToggleCompleteProp(id);
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        );
      }
    },
    [onToggleCompleteProp],
  );

  const deleteTask = React.useCallback(
    (id: string) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      const titleToShow = taskToDelete
        ? `"${taskToDelete.title}"`
        : "this task";

      Alert.alert(
        "Delete Task",
        `Are you sure you want to delete task ${titleToShow}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              if (onDeleteTaskProp) {
                onDeleteTaskProp(id);
              } else {
                setTasks((prevTasks) =>
                  prevTasks.filter((task) => task.id !== id),
                );
              }
            },
          },
        ],
        { cancelable: true },
      );
    },
    [tasks, setTasks, onDeleteTaskProp],
  );

  const saveEdit = React.useCallback(
    (
      id: string,
      newTitle: string,
      newNote?: string,
      newSubtasks?: Task["subtasks"],
    ) => {
      if (onSaveEditProp) {
        onSaveEditProp(id, newTitle, newNote, newSubtasks);
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title: newTitle,
                  note: newNote ? newNote.trim() : undefined,
                  subtasks: newSubtasks,
                }
              : task,
          ),
        );
      }
    },
    [setTasks, onSaveEditProp],
  );

  // Get Dynamic Tag Filters list
  const tagFilters = ["All", ...uniqueTags];

  // Filtering and sorting logic
  const getFilteredAndSortedTasks = () => {
    let filtered = [...tasks];

    if (filter === "Completed") {
      filtered = filtered.filter((t) => t.completed);
    } else if (filter === "Incomplete") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filter === "Overdue") {
      const now = new Date();
      filtered = filtered.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now,
      );
    }

    if (tagFilter !== "All") {
      filtered = filtered.filter((t) => t.tags && t.tags.includes(tagFilter));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(query));
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy) {
        switch (sortBy) {
          case "priority": {
            const priorityWeight = { High: 3, Medium: 2, Low: 1 };
            const diff =
              priorityWeight[b.priority] - priorityWeight[a.priority];
            if (diff !== 0) return diff;
            break;
          }
          case "dueDate": {
            if (a.dueDate && b.dueDate)
              return (
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              );
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            break;
          }
          case "alphabet":
            return a.title.localeCompare(b.title, "en");
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredTasks = getFilteredAndSortedTasks();

  const getEmptyStateConfig = () => {
    if (tasks.length === 0) {
      return {
        message: "Please add a task!",
        icon: "clipboard-outline" as const,
      };
    }
    if (searchQuery.trim() !== "") {
      return {
        message: "Task not found",
        icon: "search-outline" as const,
      };
    }
    if (filter === "Completed") {
      return {
        message: "No completed tasks yet!",
        icon: "checkmark-done-circle-outline" as const,
      };
    }
    if (filter === "Incomplete") {
      return {
        message: "No pending tasks yet!",
        icon: "time-outline" as const,
      };
    }
    if (filter === "Overdue") {
      return {
        message: "No overdue tasks yet!",
        icon: "alert-circle-outline" as const,
      };
    }
    if (tagFilter !== "All") {
      return {
        message: `No tasks with tag #${tagFilter} yet!`,
        icon: "pricetag-outline" as const,
      };
    }
    return {
      message: "No tasks match your filters",
      icon: "filter-outline" as const,
    };
  };

  const emptyStateConfig = getEmptyStateConfig();

  const renderHeader = () => (
    <View style={{ paddingBottom: 16, zIndex: 100, elevation: 10 }}>
      {ListHeaderComponent}

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Unified Filter Dropdowns Row (Status & Sort) */}
      <View style={styles.filterRow}>
        {/* Status Dropdown */}
        <Dropdown
          label="Status"
          value={filter}
          options={STATUS_OPTIONS}
          isOpen={activeDropdown === "status"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "status" ? null : "status")
          }
          onSelect={(val) => {
            setFilter(val as FilterType);
            setActiveDropdown(null);
          }}
        />

        {/* Sort Dropdown */}
        <Dropdown
          label="Sort By"
          value={sortBy}
          options={SORT_OPTIONS}
          isOpen={activeDropdown === "sort"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "sort" ? null : "sort")
          }
          onSelect={(val) => {
            setSortBy(val as SortType);
            setActiveDropdown(null);
          }}
        />
      </View>

      {/* Dynamic Tag Filters (Dropdown style, spans 100% width) */}
      {uniqueTags.length > 0 && (
        <View style={styles.categoryFiltersWrapper}>
          <Dropdown
            label="Filter by Tag"
            value={tagFilter}
            options={tagFilters.map((t) => ({
              id: t,
              label: t === "All" ? "All Tags" : `#${t}`,
            }))}
            isOpen={activeDropdown === "tag"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "tag" ? null : "tag")
            }
            onSelect={(val) => {
              setTagFilter(val);
              setActiveDropdown(null);
            }}
            triggerPrefix="🏷️ "
            isFullWidth={true}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Full Task List */}
      <View style={[styles.taskList, { flex: 1 }]}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          ListHeaderComponentStyle={{ zIndex: 100, elevation: 10 }}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={
            <TouchableOpacity
              activeOpacity={onNavigateToCreate ? 0.7 : 1}
              disabled={!onNavigateToCreate}
              onPress={onNavigateToCreate}
              style={[
                styles.emptyState,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name={emptyStateConfig.icon}
                size={64}
                color={colors.border}
              />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {emptyStateConfig.message}
              </Text>
            </TouchableOpacity>
          }
          renderItem={({ item: task }) => (
            <View style={{ zIndex: activeDropdown ? -1 : 1, elevation: activeDropdown ? -1 : 1 }}>
              <TaskItem
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onSaveEdit={saveEdit}
                onToggleSubtask={onToggleSubtask}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};
