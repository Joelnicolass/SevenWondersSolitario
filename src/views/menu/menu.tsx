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

const Menu = () => {
  const {cards, form} = useCardsContext();
  const shuffleBack = useSharedValue(true);
  const {bottom, top} = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161616',
        paddingBottom: bottom,
        paddingTop: top,
      }}>
      <Image
        source={require('../../../assets/bg.png')}
        style={{
          position: 'absolute',
          top: top,
          left: 0,
          right: 0,
          bottom: 0,
          resizeMode: 'cover',
          width: '100%',
          height: '100%',
        }}
        blurRadius={15}
      />
      <View
        style={{
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
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Elige a tu rival
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 40,
        }}>
        {cards.leaders.map((card, index) => (
          <Card
            card={{
              data: {...card},
              source: card.image,
            }}
            key={index}
            index={index}
            shuffleBack={shuffleBack}
            onSwiped={(_, data) => {
              startTransition(() => {
                form.selectLeader(data.name);
                cards.shuffleActionDeck();
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

      <View style={styles.buttonsContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              gap: 6,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
              }}>
              Agora
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#f4a230'}}
              thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                startTransition(() => {
                  form.toggleAgora(value);
                });
              }}
              value={form.useAgora}
            />
          </View>

          <View
            style={{
              gap: 6,
              marginLeft: 20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
              }}>
              Pantheon
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#f4a230'}}
              thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                startTransition(() => {
                  form.togglePantheon(value);
                });
              }}
              value={form.usePantheon}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            borderRadius: 4,
            backgroundColor: '#f4a230',
            padding: 10,
            elevation: 2,
          }}
          onPress={() => {}}>
          <Text
            style={{
              color: 'white',
            }}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
});
