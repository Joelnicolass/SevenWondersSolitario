import React, {startTransition} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCardsContext} from '../../contexts/cards_context';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePreventBack} from '../../hooks/use_prevent_back';
import {Card} from '../../card';
import {useSharedValue} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

const GameScreen = () => {
  const {cards, form} = useCardsContext();
  const shuffleBack = useSharedValue(true);
  const navigation = useNavigation();
  usePreventBack();

  const selectedLeader = cards.leaders.find(
    leader => leader.name === form.selectedLeader,
  );

  const {top, bottom} = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {selectedLeader?.image && (
        <Image
          source={selectedLeader.image}
          resizeMode="cover"
          blurRadius={15}
          style={styles.bgImage}
        />
      )}
      <View style={styles.leaderImageContainer}>
        {selectedLeader?.image && (
          <Image
            source={selectedLeader.image}
            resizeMode="stretch"
            style={[styles.leaderImage, {marginTop: top}]}
          />
        )}
      </View>

      <View>
        {cards.actions.map((card, index) => (
          <Card
            card={{
              data: {...card},
              source: card.image,
              width: Dimensions.get('window').width * 0.8,
              height: Dimensions.get('window').height * 0.25,
            }}
            key={index}
            index={index}
            shuffleBack={shuffleBack}
            onSwiped={() => null}
            onSwipedAll={() => {
              startTransition(() => {
                cards.shuffleActionDeck();
              });
            }}
          />
        ))}
      </View>
      <View style={[styles.buttonsContainer, {bottom: bottom}]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.text}>Volver al menú</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width * 2,
    height: Dimensions.get('window').height * 2,
  },
  leaderImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leaderImage: {
    marginBottom: 50,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'white',
    aspectRatio: 3 / 4.5,
    height: Dimensions.get('window').height * 0.3,
    maxHeight: 300,
  },
  buttonsContainer: {
    position: 'absolute',
    height: 100,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 4,
    backgroundColor: '#f4a230',
    padding: 10,
    elevation: 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});
