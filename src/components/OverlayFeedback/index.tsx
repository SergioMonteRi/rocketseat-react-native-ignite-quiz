import { Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Rect, BlurMask } from "@shopify/react-native-skia";

import { THEME } from "../../styles/theme";
import { useEffect } from "react";

const STATUS = [
  "transparent",
  THEME.COLORS.BRAND_LIGHT,
  THEME.COLORS.DANGER_LIGHT,
];

type Props = {
  status: number;
};

export const OverlayFeedback = ({ status }: Props) => {
  const color = STATUS[status];

  const deviceHeight = Dimensions.get("window").height * 1.08;
  const deviceWidth = Dimensions.get("window").width;

  const opacity = useSharedValue(0);

  const styledAnimated = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  })

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.bounce }),
      withTiming(0)
    );
  }, [status]);

  return (
    <Animated.View
      style={[{
        height: deviceHeight,
        width: deviceWidth,
        position: "absolute",
        flex: 1,
      }, styledAnimated]}
    >
      <Canvas style={{ flex: 1 }}>
        <Rect
          x={0}
          y={0}
          width={deviceWidth}
          height={deviceHeight}
          color={color}
        >
          <BlurMask blur={50} style={"inner"} />
        </Rect>
      </Canvas>
    </Animated.View>
  );
};
