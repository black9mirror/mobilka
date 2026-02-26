import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Тип для вакансии
interface Vacancy {
  id: string;
  title: string;
  company: string;
  salary: string;
  city: string;
  experience: string;
  description: string;
  requirements: string[];
}

// Данные вакансий
const vacanciesData: Vacancy[] = [
  {
    id: "1",
    title: "React Native разработчик",
    company: "TechCorp",
    salary: "150 000 - 200 000 ₽",
    city: "Москва",
    experience: "от 2 лет",
    description:
      "Разработка мобильных приложений на React Native. Участие в архитектуре проекта, оптимизация производительности.",
    requirements: ["React Native", "TypeScript", "Redux", "Git"],
  },
  {
    id: "2",
    title: "HR-менеджер",
    company: "SSrch",
    salary: "80 000 - 100 000 ₽",
    city: "Казань",
    experience: "от 1 года",
    description:
      "Поиск и подбор персонала, проведение собеседований, адаптация новых сотрудников.",
    requirements: [
      "Подбор персонала",
      "Проведение интервью",
      "Коммуникабельность",
    ],
  },
  {
    id: "3",
    title: "Team Lead",
    company: "IT Solutions",
    salary: "250 000 - 300 000 ₽",
    city: "Удаленно",
    experience: "от 5 лет",
    description:
      "Управление командой разработки, планирование спринтов, код-ревью.",
    requirements: ["React", "Node.js", "Team management", "Agile"],
  },
  {
    id: "4",
    title: "UX/UI дизайнер",
    company: "Design Studio",
    salary: "120 000 - 150 000 ₽",
    city: "Казань",
    experience: "от 2 лет",
    description:
      "Проектирование интерфейсов, создание прототипов, работа с дизайн-системами.",
    requirements: ["Figma", "Adobe Creative Suite", "UX research"],
  },
  {
    id: "5",
    title: "Product Manager",
    company: "Startup",
    salary: "180 000 - 220 000 ₽",
    city: "Москва",
    experience: "от 3 лет",
    description: "Управление продуктом, аналитика, работа с требованиями.",
    requirements: ["Product management", "Аналитика", "Agile"],
  },
];

export default function VacanciesScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // Фильтрация с поиском по началу слов
  const filteredVacancies = vacanciesData.filter((vacancy) => {
    const searchLower = searchText.toLowerCase();
    return (
      vacancy.title.toLowerCase().startsWith(searchLower) ||
      vacancy.company.toLowerCase().startsWith(searchLower) ||
      vacancy.city.toLowerCase().startsWith(searchLower)
    );
  });

  const renderVacancy = ({ item }: { item: Vacancy }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#3A3A3A",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#555",
      }}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/vacancyDetails",
          params: { vacancy: JSON.stringify(item) },
        })
      }
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 5,
        }}
      >
        {item.title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text style={{ color: "#CCCCCC" }}>{item.company}</Text>
        <Text style={{ color: "#4CAF50", fontWeight: "500" }}>
          {item.salary}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#999999" }}>🏢 {item.city}</Text>
        <Text style={{ color: "#999999" }}>💼 {item.experience}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#2A2A2A", "#3A3A3A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "200",
              marginBottom: 20,
            }}
          >
            Поиск вакансий
          </Text>

          {/* Поиск */}
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
                fontSize: 16,
                textAlignVertical: "center",
                height: 50,
              }}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="🔎︎ Поиск"
              placeholderTextColor="#666"
              textAlign="left"
            />
          </View>

          {/* Счетчик результатов */}
          <Text style={{ color: "#CCCCCC", marginBottom: 10 }}>
            Найдено вакансий: {filteredVacancies.length}
          </Text>

          {/* Список вакансий */}
          <FlatList
            data={filteredVacancies}
            renderItem={renderVacancy}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{ color: "#CCCCCC", textAlign: "center", marginTop: 50 }}
              >
                Ничего не найдено
              </Text>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
