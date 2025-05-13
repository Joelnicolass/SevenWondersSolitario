import {useEffect, useState} from 'react';
import {
  CARDS_AGORA_GAME,
  CARDS_BASE_GAME,
  CARDS_PANTHEON_GAME,
} from '../utils/cards';
import {Card, CardType} from '../types/card';

export type GameSelection = {
  agora: boolean;
  pantheon: boolean;
};

export const useFilteredCards = ({agora, pantheon}: GameSelection) => {
  const baseLeaders = CARDS_BASE_GAME.filter(c => c.type === CardType.LEADER);
  const baseActions = CARDS_BASE_GAME.filter(c => c.type === CardType.ACTION);
  const agoraLeaders = CARDS_AGORA_GAME.filter(c => c.type === CardType.LEADER);
  const agoraActions = CARDS_AGORA_GAME.filter(c => c.type === CardType.ACTION);
  const pantheonLeaders = CARDS_PANTHEON_GAME.filter(
    c => c.type === CardType.LEADER,
  );
  const pantheonActions = CARDS_PANTHEON_GAME.filter(
    c => c.type === CardType.ACTION,
  );

  const [leaders, setLeaders] = useState<Card[]>([]);
  const [actions, setActions] = useState<Card[]>([]);

  const filterCards = () => {
    const selectedLeaders = [
      ...baseLeaders,
      ...(agora ? agoraLeaders : []),
      ...(pantheon ? pantheonLeaders : []),
    ];

    const selectedActions = [
      ...baseActions,
      ...(agora ? agoraActions : []),
      ...(pantheon ? pantheonActions : []),
    ];

    const exclusions = [
      ...(agora ? ['AGORA'] : []),
      ...(pantheon ? ['PANTHEON'] : []),
    ];

    // si alguna exclusion coincide con alguna exclusion de la carta, no se añade
    const filteredLeaders = selectedLeaders.filter(leader => {
      const isExcluded = leader.exclude.some(exclusion =>
        exclusions.includes(exclusion),
      );
      return !isExcluded;
    });

    const filteredActions = selectedActions.filter(action => {
      const isExcluded = action.exclude.some(exclusion =>
        exclusions.includes(exclusion),
      );
      return !isExcluded;
    });

    setLeaders(filteredLeaders);
    setActions(filteredActions);
  };

  useEffect(() => {
    filterCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agora, pantheon]);

  const shuffleDeck = (deck: Card[]) => {
    const shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };

  const shuffleLeaderDeck = () => {
    const shuffledDeck = shuffleDeck(leaders);
    setLeaders(shuffledDeck);
  };

  const shuffleActionDeck = () => {
    const shuffledDeck = shuffleDeck(actions);
    setActions(shuffledDeck);
  };

  return {
    leaders,
    actions,
    shuffleLeaderDeck,
    shuffleActionDeck,
    shuffleDeck,
  };
};
