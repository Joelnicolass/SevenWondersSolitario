import {ImageSourcePropType} from 'react-native';

export enum CardType {
  LEADER = 'LEADER',
  ACTION = 'ACTION',
}

export interface Card {
  name: string;
  type: string;
  image: ImageSourcePropType;
  exclude: string[];
}

export enum GameType {
  BASE,
  AGORA,
  PANTHEON,
}
