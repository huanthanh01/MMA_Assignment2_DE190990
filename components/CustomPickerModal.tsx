import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../constants/ThemeContext";
import { styles, ITEM_HEIGHT, VISIBLE_ITEMS, PICKER_HEIGHT } from "./styles/CustomPickerModal.styles";

// ─── Helper data generators ────────────────────────────────────
const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const pad = (n: number) => String(n).padStart(2, "0");

// ─── Single Wheel Column ───────────────────────────────────────
interface WheelColumnProps {
  data: { label: string; value: number }[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  colors: ReturnType<typeof useTheme>["colors"];
  width?: number;
}

const WheelColumn: React.FC<WheelColumnProps> = ({
  data,
  selectedValue,
  onValueChange,
  colors,
  width = 80,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const selectedIndex = data.findIndex((d) => d.value === selectedValue);
  const isScrolling = useRef(false);
  const lastScrolledIndex = useRef(selectedIndex);

  useEffect(() => {
    if (!isScrolling.current && flatListRef.current && selectedIndex >= 0) {
      if (lastScrolledIndex.current !== selectedIndex) {
        lastScrolledIndex.current = selectedIndex;
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: selectedIndex * ITEM_HEIGHT,
            animated: true,
          });
        }, 10);
      }
    }
  }, [selectedIndex, data]);

  const onMomentumScrollEnd = useCallback(
    (e: any) => {
      isScrolling.current = false;
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      if (data[clamped] && data[clamped].value !== selectedValue) {
        lastScrolledIndex.current = clamped;
        onValueChange(data[clamped].value);
      }
    },
    [data, selectedValue, onValueChange]
  );

  const onScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: { label: string; value: number }; index: number }) => {
      const isSelected = item.value === selectedValue;
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            const newIndex = data.findIndex(d => d.value === item.value);
            lastScrolledIndex.current = newIndex;
            onValueChange(item.value);
            flatListRef.current?.scrollToOffset({
              offset: newIndex * ITEM_HEIGHT,
              animated: true,
            });
          }}
          style={[styles.item, { height: ITEM_HEIGHT }]}
        >
          <Text
            style={[
              styles.itemText,
              isSelected ? styles.itemSelected : styles.itemUnselected,
              {
                color: isSelected ? colors.primary : colors.textSecondary + "80",
                transform: [{ scale: isSelected ? 1.05 : 0.95 }],
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedValue, colors, onValueChange]
  );

  const headerFooter = (
    <View style={{ height: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
  );

  return (
    <View style={[styles.column, { width, height: PICKER_HEIGHT }]}>
      {/* Selection highlight band */}
      <View
        style={[
          styles.selectionBand,
          {
            top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            height: ITEM_HEIGHT,
            backgroundColor: colors.primary + "14",
            borderColor: colors.primary + "30",
          },
        ]}
        pointerEvents="none"
      />
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => String(item.value)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        ListHeaderComponent={headerFooter}
        ListFooterComponent={headerFooter}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
      />
    </View>
  );
};

// ─── Main Custom Picker Modal ──────────────────────────────────
interface CustomPickerModalProps {
  visible: boolean;
  mode: "date" | "time";
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

export const CustomPickerModal: React.FC<CustomPickerModalProps> = ({
  visible,
  mode,
  date,
  onConfirm,
  onCancel,
}) => {
  const { colors, isDark } = useTheme();

  // Local state for picking
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const [day, setDay] = useState(date.getDate());
  const [hour, setHour] = useState(date.getHours());
  const [minute, setMinute] = useState(date.getMinutes());

  // Reset local state when modal opens
  useEffect(() => {
    if (visible) {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
      setDay(date.getDate());
      setHour(date.getHours());
      setMinute(date.getMinutes());
    }
  }, [visible, date]);

  // Adjust day if month/year changes
  useEffect(() => {
    const maxDay = getDaysInMonth(year, month);
    if (day > maxDay) setDay(maxDay);
  }, [year, month]);

  const handleConfirm = () => {
    const maxDay = getDaysInMonth(year, month);
    const safeDay = Math.min(day, maxDay);
    const result = new Date(year, month, safeDay, hour, minute, 0, 0);
    onConfirm(result);
  };

  // Data arrays
  const years = range(2020, 2035).map((y) => ({ label: String(y), value: y }));
  const months = MONTHS.map((m, i) => ({ label: m.slice(0, 3), value: i }));
  const maxDay = getDaysInMonth(year, month);
  const days = range(1, maxDay).map((d) => ({ label: pad(d), value: d }));
  const hours = range(0, 23).map((h) => ({ label: pad(h), value: h }));
  const minutes = range(0, 59).map((m) => ({ label: pad(m), value: m }));

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(100);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouch} activeOpacity={1} onPress={onCancel} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? "#1A1A1E" : "#FFFFFF",
              borderColor: colors.border,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIconBg,
                  { backgroundColor: colors.primary + "18" },
                ]}
              >
                <Ionicons
                  name={mode === "date" ? "calendar" : "time"}
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {mode === "date" ? "Select Date" : "Select Time"}
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ── Preview ── */}
          <View style={[styles.previewContainer, { backgroundColor: colors.primary + "0A" }]}>
            <Text style={[styles.previewText, { color: colors.primary }]}>
              {mode === "date"
                ? `${pad(day)} ${MONTHS[month].slice(0, 3)} ${year}`
                : `${pad(hour)} : ${pad(minute)}`}
            </Text>
          </View>

          {/* ── Wheels ── */}
          <View style={styles.wheelsRow}>
            {mode === "date" ? (
              <>
                <WheelColumn data={days} selectedValue={day} onValueChange={setDay} colors={colors} width={60} />
                <View style={styles.separator}>
                  <Text style={[styles.separatorDateText, { color: colors.textSecondary + "40" }]}>/</Text>
                </View>
                <WheelColumn data={months} selectedValue={month} onValueChange={setMonth} colors={colors} width={70} />
                <View style={styles.separator}>
                  <Text style={[styles.separatorDateText, { color: colors.textSecondary + "40" }]}>/</Text>
                </View>
                <WheelColumn data={years} selectedValue={year} onValueChange={setYear} colors={colors} width={70} />
              </>
            ) : (
              <>
                <WheelColumn data={hours} selectedValue={hour} onValueChange={setHour} colors={colors} width={80} />
                <View style={styles.separator}>
                  <Text style={[styles.separatorTimeText, { color: colors.primary }]}>:</Text>
                </View>
                <WheelColumn data={minutes} selectedValue={minute} onValueChange={setMinute} colors={colors} width={80} />
              </>
            )}
          </View>

          {/* ── Action Buttons ── */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                { borderColor: colors.border, backgroundColor: isDark ? "#222" : "#F5F5F5" },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradientBtn as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmBtnGradient}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
