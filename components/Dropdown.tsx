import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/ThemeContext";
import { AppColors } from "../constants/colors";
import { styles } from "./styles/TaskList.styles"; // Reuse task list dropdown styles

interface DropdownProps {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  triggerPrefix?: string;
  isFullWidth?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  triggerPrefix = "",
  isFullWidth = false,
}) => {
  const { colors } = useTheme();
  const selectedOption = options.find((opt) => opt.id === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  return (
    <View style={[styles.dropdownContainer, isFullWidth && { flex: undefined, width: "100%" }]}>
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownTrigger, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.8}
        onPress={onToggle}
      >
        <Text style={[styles.dropdownTriggerText, { color: colors.text }]} numberOfLines={1}>
          {triggerPrefix}{displayLabel}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: -2000,
            bottom: -2000,
            left: -2000,
            right: -2000,
            backgroundColor: "transparent",
            zIndex: 999,
          }}
          activeOpacity={1}
          onPress={onToggle}
        />
      )}

      {isOpen && (
        <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScrollView nestedScrollEnabled={true}>
            {options.map((opt, idx) => {
              const isActive = value === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.dropdownItem,
                    {
                      borderBottomWidth: idx === options.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                    },
                    isActive && { backgroundColor: colors.primary + "14" },
                  ]}
                  onPress={() => onSelect(opt.id)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: colors.text, fontWeight: isActive ? "bold" : "normal" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
