import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';

const {width: wWidth, height} = Dimensions.get('window');

const SNAP_POINTS = [-wWidth, 0, wWidth];
const aspectRatio = 722 / 368;
//const CARD_WIDTH = wWidth - 128;
//const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;
const DURATION = 250;

interface CardProps<T> {
  card: {
    width?: number;
    height?: number;
    source: ReturnType<typeof require>;
    data: T;
  };
  shuffleBack: Animated.SharedValue<boolean>;
  index: number;
  onSwiped?: (index: number, data: T) => void;
  onSwipedAll?: () => void;
  withInitialAnimation?: boolean;
}

export const Card = <T,>({
  card: {
    source,
    data,
    width: cardWidht = CARD_WIDTH,
    height: cardHeight = CARD_HEIGHT,
  },
  shuffleBack,
  index,
  onSwiped = () => null,
  onSwipedAll = () => null,
  withInitialAnimation = false,
}: CardProps<T>) => {
  const offset = useSharedValue({x: 0, y: 0});
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(withInitialAnimation ? -height : 0);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const delay = index * DURATION;
  const theta = -10 + Math.random() * 20;

  useEffect(() => {
    if (!withInitialAnimation) return;

    translateY.value = withDelay(
      delay,
      withTiming(0, {duration: DURATION, easing: Easing.inOut(Easing.ease)}),
    );
    rotateZ.value = withDelay(delay, withSpring(theta));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, index, rotateZ, theta, translateY /* withInitialAnimation */]);

  useAnimatedReaction(
    () => shuffleBack.value,
    v => {
      if (v) {
        const duration = 150 * index;
        translateX.value = withDelay(
          duration,
          withSpring(0, {}, () => {
            shuffleBack.value = false;
          }),
        );
        rotateZ.value = withDelay(duration, withSpring(theta));
      }
    },
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = {x: translateX.value, y: translateY.value};
      rotateZ.value = withTiming(0);
      scale.value = withTiming(1.1);
    })
    .onUpdate(({translationX, translationY}) => {
      translateX.value = offset.value.x + translationX;
      translateY.value = offset.value.y + translationY;
    })
    .onEnd(({velocityX, velocityY}) => {
      const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS);
      translateX.value = withSpring(dest, {velocity: velocityX});
      translateY.value = withSpring(0, {velocity: velocityY});
      scale.value = withTiming(1, {}, () => {
        const isLast = index === 0;
        const isSwipedLeftOrRight = dest !== 0;
        if (isLast && isSwipedLeftOrRight) {
          shuffleBack.value = true;
          runOnJS(onSwipedAll)();
        }
        if (isSwipedLeftOrRight) {
          runOnJS(onSwiped)(index, data);
        }
      });
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      {perspective: 1500},
      {rotateX: '20deg'},
      {translateX: translateX.value},
      {translateY: translateY.value},
      {rotateY: `${rotateZ.value / 10}deg`},
      {rotateZ: `${rotateZ.value}deg`},
      {scale: scale.value},
    ],
  }));
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'relative',
      }}>
      <View style={styles.container} pointerEvents="box-none">
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.card,
              style,
              {
                width: cardWidht,
                height: cardHeight,
              },
            ]}>
            <Image
              source={source}
              style={{
                width: cardWidht * 0.9,
                height: cardWidht * 0.9 * aspectRatio,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
