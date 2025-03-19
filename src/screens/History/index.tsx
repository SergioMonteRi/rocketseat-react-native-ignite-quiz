import { useEffect, useState } from "react";
import Animated, {
  Layout,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { HouseLine } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { HistoryCard, HistoryProps } from "../../components/HistoryCard";

import { historyGetAll, historyRemove } from "../../storage/quizHistoryStorage";

import { styles } from "./styles";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string) {
    Alert.alert("Remover", "Deseja remover esse registro?", [
      {
        text: "Sim",
        onPress: () => remove(id),
      },
      { text: "Não", style: "cancel" },
    ]);
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${"\n"}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {history.map((item) => (
          <Animated.View
            key={item.id}
            entering={SlideInRight}
            exiting={SlideOutRight}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              key={item.id}
              onPress={() => handleRemove(item.id)}
            >
              <HistoryCard data={item} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
