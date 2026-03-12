import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "../../context/FavoritesContext";

// Интерфейс вакансии
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

// Интерфейс вакансии как их возвращает API HH.ru
interface HHVacancy {
  id: string;
  name: string;
  employer: { name: string };
  salary: { from: number | null; to: number | null; currency: string } | null;
  area: { name: string };
  experience: { name: string };
  snippet: {
    requirement: string | null;
    responsibility: string | null;
  };
}

// Базовый URL API HeadHunter
const HH_API_URL = "https://api.hh.ru/vacancies";
// Количество вакансий на одной странице
const PER_PAGE = 20;
// Функция для удаления HTML-тегов из строки
const stripHtml = (str: string | null): string => {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
};
// Функция преобразования данных из формата HH.ru в формат нашего приложения
const mapHHVacancy = (item: HHVacancy): Vacancy => ({
  id: item.id,
  title: item.name, // Берем название
  company: item.employer.name, // Берем название компании
  // Форматируем зарплату: обрабатываем случаи, когда указана только "от", только "до" или обе
  salary: item.salary
    ? `${item.salary.from ?? ""}${item.salary.from && item.salary.to ? " – " : ""}${item.salary.to ?? ""} ${item.salary.currency}`.trim()
    : "Зарплата не указана",
  city: item.area.name,
  experience: item.experience.name,
  // Удаляем HTML из описания
  description: stripHtml(item.snippet.responsibility),
  // Требования
  requirements: stripHtml(item.snippet.requirement)
    .split(/[.;]/) // Разделяем строку по точке или точке с запятой
    .map((s) => s.trim()) // Убираем лишние пробелы
    .filter((s) => s.length > 3), // Убираем слишком короткие строки
});

export default function VacanciesScreen() {
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const [searchText, setSearchText] = useState("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Флаг первой загрузки
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Флаг дозагрузки
  const [error, setError] = useState<string | null>(null); // Сообщение об ошибке
  const [totalFound, setTotalFound] = useState(0); // Всего найдено вакансий
  const [currentPage, setCurrentPage] = useState(0); // Текущая загруженная страница
  const [hasMore, setHasMore] = useState(false); // Есть ли еще страницы для загрузки

  // Первый поиск — сбрасывает список и страницу
  const fetchVacancies = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true); // Показываем крутилку
    setError(null); // Сбрасываем ошибку
    setVacancies([]); // Очищаем старые вакансии
    setCurrentPage(0); // Сбрасываем страницу на 0
    setHasMore(false); // Сбрасываем флаг "еще есть"

    try {
      // Выполняем GET-запрос к API HH.ru с параметрами
      const response = await axios.get(HH_API_URL, {
        params: { text: searchText, per_page: PER_PAGE, page: 0, area: 113 }, // 113 - Россия
        headers: { "User-Agent": "SSrch/1.0 (mardanov1207@mail.ru)" },
      });
      // Преобразуем полученные данные в формат нашего приложения
      const mapped = response.data.items.map(mapHHVacancy);
      setVacancies(mapped);
      setTotalFound(response.data.found);

      // HH.ru возвращает pages — общее количество страниц
      setHasMore(response.data.pages > 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Ошибка: ${err.response?.status ?? "нет соединения"}`);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка следующей страницы — добавляет к существующему списку
  const loadMore = async () => {
    const nextPage = currentPage + 1;

    setIsLoadingMore(true);

    try {
      // Тот же запрос, но с другим номером страницы
      const response = await axios.get(HH_API_URL, {
        params: {
          text: searchText,
          per_page: PER_PAGE,
          page: nextPage,
          area: 113,
        },
        headers: { "User-Agent": "SSrch/1.0 (mardanov1207@mail.ru)" },
      });

      const mapped = response.data.items.map(mapHHVacancy);
      // Добавляем новые вакансии к уже существующим
      setVacancies((prev) => [...prev, ...mapped]);
      setCurrentPage(nextPage);
      setHasMore(nextPage + 1 < response.data.pages);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Ошибка: ${err.response?.status ?? "нет соединения"}`);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setIsLoadingMore(false);
    }
  };
  // Функция для отрисовки одной карточки вакансии
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
            flex: 1,
            marginRight: 10,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {isFavorite(item.id) ? "❤️" : "🤍"}
        </Text>
      </View>
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

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#3A3A3A",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 5,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#555",
        }}
        onPress={loadMore}
        disabled={isLoadingMore}
      >
        {isLoadingMore ? (
          <ActivityIndicator size="small" color="#CCCCCC" />
        ) : (
          <Text style={{ color: "#CCCCCC", fontWeight: "500" }}>
            Загрузить ещё
          </Text>
        )}
      </TouchableOpacity>
    );
  };

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

          {/* Поиск + кнопка */}
          <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
                fontSize: 16,
                height: 50,
              }}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="🔎︎ Поиск"
              placeholderTextColor="#666"
              returnKeyType="search"
              onSubmitEditing={fetchVacancies}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 18,
                justifyContent: "center",
                height: 50,
              }}
              onPress={fetchVacancies}
              disabled={isLoading}
            >
              <Text style={{ color: "#2A2A2A", fontWeight: "600" }}>Найти</Text>
            </TouchableOpacity>
          </View>

          {/* Счетчик / загрузка / ошибка */}
          {isLoading ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <ActivityIndicator size="small" color="#CCCCCC" />
              <Text style={{ color: "#CCCCCC", marginLeft: 8 }}>
                Загрузка...
              </Text>
            </View>
          ) : error ? (
            <Text style={{ color: "#FF6B6B", marginBottom: 10 }}>{error}</Text>
          ) : vacancies.length > 0 ? (
            <Text style={{ color: "#CCCCCC", marginBottom: 10 }}>
              Найдено: {totalFound.toLocaleString()} · показано:{" "}
              {vacancies.length}
            </Text>
          ) : null}

          {/* Список вакансий */}
          <FlatList
            data={vacancies}
            renderItem={renderVacancy}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              !isLoading ? (
                <Text
                  style={{
                    color: "#CCCCCC",
                    textAlign: "center",
                    marginTop: 50,
                  }}
                >
                  Введите запрос для поиска
                </Text>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
