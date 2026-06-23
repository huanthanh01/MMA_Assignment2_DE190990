import { useState, Dispatch, SetStateAction } from "react";
import { Subtask } from "../models/types";

interface UseTaskFormProps {
  onAddTask: (taskData: {
    title: string;
    tags: string[];
    priority: "High" | "Medium" | "Low";
    startDate?: Date;
    dueDate?: Date;
    note?: string;
    subtasks?: Subtask[];
  }) => void;
  suggestedTags: string[];
  setSuggestedTags: Dispatch<SetStateAction<string[]>>;
}

export const useTaskForm = ({ onAddTask, suggestedTags, setSuggestedTags }: UseTaskFormProps) => {
  const [inputText, setInputText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    startDate?: string;
    dueDate?: string;
  }>({});

  const handleTitleChange = (text: string) => {
    setInputText(text);
    if (text.trim() !== "") {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (clean) {
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      if (!suggestedTags.includes(clean)) {
        setSuggestedTags([...suggestedTags, clean]);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDeleteSuggestedTag = (tagToDelete: string) => {
    setSuggestedTags(suggestedTags.filter((t) => t !== tagToDelete));
    setTags(tags.filter((t) => t !== tagToDelete));
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim()) {
      addTag(customTagInput);
      setCustomTagInput("");
    }
  };

  // Subtask management
  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    const newSubtask: Subtask = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      title: text,
      completed: false,
    };
    setSubtasks((prev) => [...prev, newSubtask]);
    setSubtaskInput("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSetStartDate = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      setErrors((prev) => {
        const next: typeof errors = { ...prev, startDate: undefined };
        if (dueDate && date <= dueDate) {
          next.dueDate = undefined;
        }
        return next;
      });
    }
  };

  const handleSetDueDate = (date: Date | undefined) => {
    setDueDate(date);
    if (date) {
      setErrors((prev) => {
        const next: typeof errors = { ...prev, dueDate: undefined };
        if (startDate && startDate > date) {
          next.dueDate = "End deadline must be after start date.";
        }
        return next;
      });
    }
  };

  const handleAdd = () => {
    const newErrors: typeof errors = {};

    if (inputText.trim() === "") {
      newErrors.title = "Task title is required.";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!dueDate) {
      newErrors.dueDate = "End deadline is required.";
    } else if (startDate && startDate > dueDate) {
      newErrors.dueDate = "End deadline must be after start date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddTask({
      title: inputText.trim(),
      tags: tags,
      priority: selectedPriority,
      startDate: startDate,
      dueDate: dueDate,
      note: note.trim() || undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });

    // Reset Form
    setInputText("");
    setTags([]);
    setCustomTagInput("");
    setStartDate(undefined);
    setDueDate(undefined);
    setSelectedPriority("Medium");
    setNote("");
    setSubtasks([]);
    setSubtaskInput("");
    setErrors({});
  };

  return {
    inputText,
    tags,
    customTagInput,
    selectedPriority,
    startDate,
    dueDate,
    note,
    subtasks,
    subtaskInput,
    errors,
    handleTitleChange,
    addTag,
    removeTag,
    handleDeleteSuggestedTag,
    handleAddCustomTag,
    setCustomTagInput,
    setSelectedPriority,
    setStartDate: handleSetStartDate,
    setDueDate: handleSetDueDate,
    setNote,
    addSubtask,
    removeSubtask,
    setSubtaskInput,
    handleAdd,
  };
};

