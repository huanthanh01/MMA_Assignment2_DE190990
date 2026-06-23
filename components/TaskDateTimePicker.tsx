import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/TaskInput.styles";
import { CustomPickerModal } from "./CustomPickerModal";

interface TaskDateTimePickerProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  error?: string;
}

const formatDateToWebString = (date: Date | undefined): string => {
  if (!date) return "";
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDate = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTime = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const TaskDateTimePicker: React.FC<TaskDateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const { colors, isDark } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const showNativePicker = (mode: "date" | "time") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onPickerConfirm = (selectedDate: Date) => {
    setShowPicker(false);
    const currentVal = value ? new Date(value) : new Date();
    if (pickerMode === "date") {
      currentVal.setFullYear(selectedDate.getFullYear());
      currentVal.setMonth(selectedDate.getMonth());
      currentVal.setDate(selectedDate.getDate());
    } else {
      currentVal.setHours(selectedDate.getHours());
      currentVal.setMinutes(selectedDate.getMinutes());
    }
    onChange(new Date(currentVal));
  };

  const clearValue = () => {
    onChange(undefined);
  };

  const borderColor = error ? AppColors.error : colors.border;
  const activeBg = isDark
    ? colors.primary + "18"
    : colors.primary + "0C";
  const inactiveBg = isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.02)";

  return (
    <View style={styles.optionRow}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {Platform.OS === "web" ? (
        <View style={styles.webPickerContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: error ? AppColors.error : colors.border,
              borderRadius: 12,
              backgroundColor: value ? activeBg : inactiveBg,
              paddingLeft: 12,
              paddingRight: 4,
              overflow: "hidden",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={value ? colors.primary : colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <input
              type="datetime-local"
              value={formatDateToWebString(value)}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  onChange(new Date(val));
                } else {
                  onChange(undefined);
                }
              }}
              style={{
                padding: "10px 8px",
                border: "none",
                backgroundColor: "transparent",
                color: colors.text,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                outline: "none",
                cursor: "pointer",
                minWidth: 180,
              }}
            />
          </View>
          {value && (
            <TouchableOpacity
              style={[styles.clearBtn, { backgroundColor: AppColors.error + "14" }]}
              onPress={clearValue}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={AppColors.error} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.nativePickerContainer}>
          {/* Date Button */}
          <TouchableOpacity
            style={[
              styles.pickerButton,
              {
                borderColor: borderColor,
                backgroundColor: value ? activeBg : inactiveBg,
              },
            ]}
            onPress={() => showNativePicker("date")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={value ? colors.primary : colors.textSecondary}
              style={styles.pickerButtonIcon}
            />
            <Text
              style={
                value
                  ? [styles.pickerButtonText, { color: colors.text }]
                  : [styles.pickerButtonPlaceholder, { color: colors.textSecondary }]
              }
            >
              {value ? formatDate(value) : "Select date"}
            </Text>
          </TouchableOpacity>

          {/* Time Button */}
          <TouchableOpacity
            style={[
              styles.pickerButton,
              {
                borderColor: borderColor,
                backgroundColor: value ? activeBg : inactiveBg,
              },
            ]}
            onPress={() => showNativePicker("time")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={value ? colors.primary : colors.textSecondary}
              style={styles.pickerButtonIcon}
            />
            <Text
              style={
                value
                  ? [styles.pickerButtonText, { color: colors.text }]
                  : [styles.pickerButtonPlaceholder, { color: colors.textSecondary }]
              }
            >
              {value ? formatTime(value) : "Select time"}
            </Text>
          </TouchableOpacity>

          {/* Clear Button */}
          {value && (
            <TouchableOpacity
              style={[styles.clearBtn, { backgroundColor: AppColors.error + "14" }]}
              onPress={clearValue}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={AppColors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {error ? (
        <Text style={{ color: AppColors.error, fontSize: 11, marginTop: 4, marginLeft: 4, fontWeight: "600" }}>
          ⚠️ {error}
        </Text>
      ) : null}

      {/* Custom Picker Modal (replaces native spinner for a premium look) */}
      {Platform.OS !== "web" && (
        <CustomPickerModal
          visible={showPicker}
          mode={pickerMode}
          date={value || new Date()}
          onConfirm={onPickerConfirm}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </View>
  );
};
