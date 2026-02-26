import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: "#2A2A2A", flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Личный кабинет
        </Text>
        <View
          style={{
            backgroundColor: "#3A3A3A",
            padding: 20,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 5,
            }}
          >
            Пользователь
          </Text>
          <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
            user123@mail.ru
          </Text>
        </View>
        <Text style={{ color: "#CCCCCC", fontSize: 16, lineHeight: 24 }}>
          Здесь будет размещен личный кабинет пользователя.
        </Text>
      </View>
    </SafeAreaView>
  );
}
