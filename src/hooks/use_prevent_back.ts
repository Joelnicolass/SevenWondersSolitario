import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export const usePreventBack = () => {
  useEffect(() => {
    const onBackPress = () => true;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove();
  }, []);
};
