import {
  Dimensions,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {startTransition} from 'react';
import {Card} from '../../card';
import {useSharedValue} from 'react-native-reanimated';
import {useCardsContext} from '../../contexts/cards_context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const MenuScreen = () => {
  const navigator = useNavigation<
    NavigationProp<
      {
        Menu: undefined;
        Game: undefined;
      },
      'Menu' | 'Game'
    >
  >();
  const shuffleBack = useSharedValue(true);
  const {top, bottom} = useSafeAreaInsets();
  const {cards, form} = useCardsContext();

  return (
    <View style={[styles.safeAreaContainer, {paddingTop: top}]}>
      <Image
        source={require('../../../assets/bg.png')}
        style={styles.bgImage}
        blurRadius={100}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Elige a tu rival</Text>
      </View>
      <View style={styles.swiperContainer}>
        {cards.leaders.map((card, index) => (
          <Card
            card={{
              data: {...card},
              source: card.image,
            }}
            key={index}
            index={index}
            shuffleBack={shuffleBack}
            onSwiped={() => {
              startTransition(() => {
                const leaderIndex = index - 1;
                if (leaderIndex < 0) {
                  form.selectLeader(
                    cards.leaders[cards.leaders.length - 1].name,
                  );
                  return;
                }
                if (leaderIndex >= cards.leaders.length) {
                  form.selectLeader(cards.leaders[0].name);
                } else {
                  form.selectLeader(cards.leaders[leaderIndex].name);
                }
              });
            }}
            onSwipedAll={() => {
              startTransition(() => {
                cards.shuffleLeaderDeck();
              });
            }}
          />
        ))}
      </View>

      <View style={[styles.buttonsContainer, {marginBottom: bottom}]}>
        <View style={styles.switchContainer}>
          <View style={styles.switchAndText}>
            <Text style={styles.text}>Agora</Text>
            <Switch
              trackColor={{false: '#767577', true: '#f4a230'}}
              thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                startTransition(() => {
                  form.toggleAgora(value);
                  cards.shuffleActionDeck();
                });
              }}
              value={form.useAgora}
            />
          </View>

          <View style={[styles.switchAndText, styles.separationLeft]}>
            <Text style={styles.text}>Pantheon</Text>
            <Switch
              trackColor={{false: '#767577', true: '#f4a230'}}
              thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                startTransition(() => {
                  form.togglePantheon(value);
                  cards.shuffleActionDeck();
                });
              }}
              value={form.usePantheon}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonNext}
          onPress={() => {
            startTransition(() => {
              cards.shuffleActionDeck();
            });
            navigator.navigate('Game');
          }}>
          <Text style={styles.text}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width: '95%',
    height: '75%',
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    height: '10%',
  },
  renderCardImage: {
    height: Dimensions.get('window').height / 1.5,
    width: '100%',
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    resizeMode: 'cover',
    width: '100%',
    height: '110%',
  },
  titleContainer: {
    height: Dimensions.get('window').height / 3,
    minHeight: 200,
    maxHeight: 300,
    width: '100%',
    alignItems: 'center',
    padding: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  swiperContainer: {
    flex: 1,
    marginTop: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchAndText: {
    gap: 6,
  },
  text: {color: 'white', fontSize: 16},
  separationLeft: {marginLeft: 8},
  buttonNext: {
    borderRadius: 4,
    backgroundColor: '#f4a230',
    padding: 10,
    elevation: 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
