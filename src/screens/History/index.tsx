import { useEffect, useRef, useState } from "react";
import Animated, {
  Layout,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { HouseLine, Trash } from "phosphor-react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { HistoryCard, HistoryProps } from "../../components/HistoryCard";

import { historyGetAll, historyRemove } from "../../storage/quizHistoryStorage";

import { styles } from "./styles";
import { THEME } from "../../styles/theme";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipeableRefs = useRef<Swipeable[]>([]);

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string, index: number) {
    swipeableRefs.current?.[index].close();

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
        {history.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={SlideInRight}
            exiting={SlideOutRight}
            layout={Layout.springify()}
          >
            <Swipeable
              ref={(ref) => {
                if (ref) {
                  swipeableRefs.current.push(ref);
                }
              }}
              overshootLeft={false}
              leftThreshold={10}
              renderRightActions={() => null}
              containerStyle={styles.swipeableContainer}
              onSwipeableOpen={() => handleRemove(item.id, index)}
              renderLeftActions={() => (
                <View style={styles.swipeableRemove}>
                  <Trash size={32} color={THEME.COLORS.GREY_100} />
                </View>
              )}
            >
              <HistoryCard data={item} />
            </Swipeable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
