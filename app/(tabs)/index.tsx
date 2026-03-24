import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function WelcomeScreen() {
  const { colors } = useTheme(); // Получаем цвета из темы

  return (
    <LinearGradient colors={colors.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Логотип - стилизованная буква S */}
          <View
            style={{
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 80,
                  fontWeight: "300",
                  color: colors.textPrimary,
                  opacity: 0.9,
                  letterSpacing: -5,
                  transform: [{ skewX: "-5deg" }],
                }}
              >
                S
              </Text>
              <Text
                style={{
                  fontSize: 80,
                  fontWeight: "300",
                  color: colors.textPrimary,
                  opacity: 0.7,
                  letterSpacing: -5,
                  transform: [{ skewX: "-5deg" }],
                  marginLeft: -15,
                }}
              >
                S
              </Text>
              <Text
                style={{
                  fontSize: 80,
                  fontWeight: "300",
                  color: colors.textPrimary,
                  opacity: 0.5,
                  letterSpacing: -5,
                  transform: [{ skewX: "-5deg" }],
                  marginLeft: -15,
                }}
              >
                S
              </Text>
            </View>

            {/* Декоративная линия */}
            <View
              style={{
                width: 100,
                height: 2,
                backgroundColor: colors.textPrimary,
                opacity: 0.3,
                marginTop: 10,
                marginBottom: 5,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                color: colors.textTertiary,
                letterSpacing: 4,
                fontWeight: "300",
                marginTop: 5,
              }}
            >
              SEARCH
            </Text>
          </View>

          {/* Название приложения */}
          <Text
            style={{
              fontSize: 48,
              fontWeight: "200",
              color: colors.textPrimary,
              letterSpacing: 8,
              marginBottom: 20,
            }}
          >
            SSrch
          </Text>

          {/* Блок с описанием функционала */}
          <View style={{ alignItems: "center", marginBottom: 60 }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 8,
                fontWeight: "300",
                letterSpacing: 1,
              }}
            >
              интеллектуальный подбор персонала
            </Text>
            <View
              style={{
                width: 40,
                height: 1,
                backgroundColor: colors.textPrimary,
                opacity: 0.3,
                marginVertical: 15,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.textTertiary,
                textAlign: "center",
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              AI-ассистент для рекрутинга
            </Text>
          </View>

          {/* Дополнительная информация */}
          <View
            style={{
              position: "absolute",
              bottom: 30,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: colors.textMuted,
                letterSpacing: 1,
              }}
            >
              © 2026 SSrch
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
