import React from 'react';

import Menu from './src/views/menu/menu';

import {CardsProvider} from './src/contexts/cards_context';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <CardsProvider>
          <Menu />
        </CardsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
