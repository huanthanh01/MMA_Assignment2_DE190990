import { Task } from "../models/types";
import { AppColors } from "../constants/colors";

export const getCountdownText = (dueDate: Date, completed: boolean, now: Date) => {
  if (completed) return "";
  const diff = dueDate.getTime() - now.getTime();

  if (diff <= 0) {
    const absDiff = Math.abs(diff);
    const secs = Math.floor(absDiff / 1000);
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `Overdue: ${days}d ${hrs % 24}h`;
    if (hrs > 0) return `Overdue: ${hrs}h ${mins % 60}m`;
    if (mins > 0) return `Overdue: ${mins}m ${secs % 60}s`;
    return `Overdue: ${secs}s`;
  }

  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days}d ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  if (mins > 0) return `${mins}m ${secs % 60}s`;
  return `${secs}s`;
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return AppColors.error;
    case "Medium":
      return AppColors.warning;
    case "Low":
      return AppColors.success;
    default:
      return AppColors.textMuted;
  }
};

export const getPriorityLabel = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return "High 🔥";
    case "Medium":
      return "Medium ⚡";
    case "Low":
      return "Low 🌱";
  }
};
