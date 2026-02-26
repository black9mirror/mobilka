import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VacancyDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Получаем данные вакансии из параметров
  const vacancy = params.vacancy ? JSON.parse(params.vacancy as string) : null;

  if (!vacancy) {
    return (
      <LinearGradient colors={["#2A2A2A", "#3A3A3A"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: "white" }}>Вакансия не найдена</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#2A2A2A", "#3A3A3A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Кнопка назад */}
          <TouchableOpacity
            style={{ marginBottom: 20 }}
            onPress={() => router.push("/(tabs)/vacancies")}
          >
            <Text style={{ color: "#CCCCCC", fontSize: 16 }}>
              ← Назад к списку
            </Text>
          </TouchableOpacity>

          {/* Заголовок */}
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            {vacancy.title}
          </Text>

          {/* Компания */}
          <Text style={{ color: "#CCCCCC", fontSize: 20, marginBottom: 15 }}>
            {vacancy.company}
          </Text>

          {/* Основная информация */}
          <View
            style={{
              backgroundColor: "#3A3A3A",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#CCCCCC" }}>💰 Заработная плата:</Text>
              <Text style={{ color: "#4CAF50", fontWeight: "500" }}>
                {vacancy.salary}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#CCCCCC" }}>🏢 Город:</Text>
              <Text style={{ color: "white" }}>{vacancy.city}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#CCCCCC" }}>💼 Требования к опыту:</Text>
              <Text style={{ color: "white" }}>{vacancy.experience}</Text>
            </View>
          </View>

          {/* Описание */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
              }}
            >
              Описание вакансии
            </Text>
            <Text style={{ color: "#CCCCCC", lineHeight: 22 }}>
              {vacancy.description}
            </Text>
          </View>

          {/* Требования */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
              }}
            >
              Требования
            </Text>
            {vacancy.requirements.map((req: string, index: number) => (
              <View
                key={index}
                style={{ flexDirection: "row", marginBottom: 8 }}
              >
                <Text style={{ color: "#4CAF50", marginRight: 10 }}>•</Text>
                <Text style={{ color: "#CCCCCC", flex: 1 }}>{req}</Text>
              </View>
            ))}
          </View>

          {/* Кнопка отклика */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 30,
            }}
            onPress={() => alert("Отклик отправлен!")}
          >
            <Text style={{ color: "#2A2A2A", fontSize: 16, fontWeight: "600" }}>
              ОТКЛИКНУТЬСЯ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
