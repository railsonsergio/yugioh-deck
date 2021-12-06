import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { height, width } from '~/constants/dimension';
import { snapPoint } from '~/utils';

const imageWidth = 542;
const imageHeight = 790;

const aspectRatio = imageHeight / imageWidth;
const cardWidth = width - 128;
const cardHeight = cardWidth * aspectRatio;
const snapPoints = [-width, 0, width];
const easing = Easing.inOut(Easing.ease);
const duration = 250;

type PanGestureHandlerContext = {
  x: number;
  y: number;
};

type CardProps = {
  index: number;
  shuffleBack: Animated.SharedValue<boolean>;
  card: {
    source: ReturnType<typeof require>;
  };
};

export function Card({ card, index, shuffleBack }: CardProps) {
  const offsetX = useSharedValue(Math.random() * width - cardWidth);
  const offsetY = useSharedValue(-height);
  const rotateX = useSharedValue(25);
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);

  useAnimatedReaction(
    () => shuffleBack.value,
    value => {
      if (value) {
        const delay = 150 * index;
        const theta = Math.random() * 20 - 10;

        offsetX.value = withDelay(delay, withSpring(0));
        rotateZ.value = withDelay(
          delay,
          withSpring(theta, { velocity: 100 }, () => {
            shuffleBack.value = false;
          })
        );
      }
    }
  );

  useEffect(() => {
    const delay = 1000 + index * duration;
    const theta = Math.random() * 15 - 5;

    offsetX.value = withDelay(delay, withTiming(0, { duration, easing }));
    offsetY.value = withDelay(delay, withTiming(0, { duration, easing }));
    rotateZ.value = withDelay(delay, withSpring(theta));
  }, []);

  const animatedGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureHandlerContext
  >({
    onStart: (_, ctx) => {
      ctx.x = offsetX.value;
      ctx.y = offsetY.value;

      rotateZ.value = withTiming(0);
      scale.value = withTiming(1.1);

      if (rotateX.value !== 25) {
        rotateX.value = withTiming(25);
      }
    },
    onActive: ({ translationX, translationY }, ctx) => {
      offsetX.value = ctx.x + translationX;
      offsetY.value = ctx.y + translationY;
    },
    onEnd: ({ velocityX, velocityY }) => {
      const dest = snapPoint(offsetX.value, velocityX, snapPoints);

      offsetX.value = withSpring(dest, { velocity: velocityX });
      offsetY.value = withSpring(0, { velocity: velocityY });

      scale.value = withTiming(1, { easing }, () => {
        if (index === 0 && dest !== 0) {
          shuffleBack.value = true;
        }
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1500 },
      { rotateX: `${rotateX.value}deg` },
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { rotateY: `${rotateZ.value / 10}deg` },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value },
    ],
  }));

  function handleDoubleTap() {
    offsetX.value = withDelay(100, withTiming(0));
    offsetY.value = withDelay(100, withTiming(0));

    rotateZ.value = withDelay(150, withTiming(0));
    rotateX.value = withDelay(200, withSpring(0));

    scale.value = withDelay(300, withTiming(1.36));
  }

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={animatedGestureHandler} minDist={0}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TapGestureHandler numberOfTaps={2} onActivated={handleDoubleTap}>
            <Image source={card.source} style={styles.image} resizeMode="contain" />
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#CDCDCD',
    borderWidth: 2,
    borderRadius: 8,
  },
  image: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 3,
  },
});
