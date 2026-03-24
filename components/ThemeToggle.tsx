import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.card,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: "center",
        marginTop: 15,
      }}
      onPress={toggleTheme}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 14 }}>
        {theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
      </Text>
    </TouchableOpacity>
  );
}
