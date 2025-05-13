import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

import RootStack from './src/navigation/root_navigator';

import {CardsProvider} from './src/contexts/cards_context';

import './gesture-handler';

const App = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <CardsProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </CardsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
