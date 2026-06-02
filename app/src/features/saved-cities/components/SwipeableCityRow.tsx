import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { colors } from "../../../theme/common";
import { CityWeatherRow, type CityWeatherRowProps } from "./CityWeatherRow";

const ACTION_WIDTH = 88;

interface DeleteActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onDelete: () => void;
}

function DeleteAction({ dragX, onDelete }: DeleteActionProps) {
  const translateX = dragX.interpolate({
    inputRange: [-ACTION_WIDTH, 0],
    outputRange: [0, ACTION_WIDTH],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.deleteContainer, { transform: [{ translateX }] }]}
    >
      <RectButton style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteLabel}>Delete</Text>
      </RectButton>
    </Animated.View>
  );
}

export interface SwipeableCityRowProps extends CityWeatherRowProps {
  onPress?: () => void;
  onDelete: (cityName: string) => void;
  onSwipeBegin?: (ref: Swipeable) => void;
}

export function SwipeableCityRow({
  cityName,
  weather,
  isLoading,
  errorMessage,
  onPress,
  onDelete,
  onSwipeBegin,
}: SwipeableCityRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(cityName);
  };

  return (
    <View style={styles.wrapper}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        overshootRight={false}
        overshootFriction={8}
        rightThreshold={ACTION_WIDTH * 0.4}
        enableTrackpadTwoFingerGesture
        onSwipeableOpenStartDrag={() => {
          if (swipeableRef.current) {
            onSwipeBegin?.(swipeableRef.current);
          }
        }}
        renderRightActions={(_progress, dragX) => (
          <DeleteAction dragX={dragX} onDelete={handleDelete} />
        )}
        containerStyle={styles.swipeableContainer}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`View forecast for ${cityName}`}
        >
          <CityWeatherRow
            cityName={cityName}
            weather={weather}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  swipeableContainer: {
    overflow: "hidden",
    borderRadius: 10,
  },
  deleteContainer: {
    width: ACTION_WIDTH,
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  deleteLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
