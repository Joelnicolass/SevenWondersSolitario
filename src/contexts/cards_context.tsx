import {createContext, useContext, useEffect, useReducer} from 'react';
import {useFilteredCards} from '../hooks/use_filtered_cards';
import {Card} from '../types/card';

interface CardsProviderProps {
  children: React.ReactNode;
}

interface CardContextState {
  cards: {
    leaders: Card[];
    actions: Card[];
    shuffleDeck: (deck: Card[]) => Card[];
    shuffleActionDeck: () => void;
    shuffleLeaderDeck: () => void;
  };
  form: {
    useAgora: boolean;
    usePantheon: boolean;
    selectedLeader: string | null;
    toggleAgora: (value: boolean) => void;
    togglePantheon: (value: boolean) => void;
    selectLeader: (leader: string) => void;
  };
}
export const CardsContext = createContext({} as CardContextState);

type State = {
  agora: boolean;
  pantheon: boolean;
  selectedLeader: string | null;
};

type Action =
  | {type: 'TOGGLE_AGORA'; payload: boolean}
  | {type: 'TOGGLE_PANTHEON'; payload: boolean}
  | {type: 'SELECT_LEADER'; payload: string};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_AGORA':
      return {...state, agora: action.payload};
    case 'TOGGLE_PANTHEON':
      return {...state, pantheon: action.payload};
    case 'SELECT_LEADER':
      return {...state, selectedLeader: action.payload};
    default:
      return state;
  }
}

export const CardsProvider = ({children}: CardsProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    agora: false,
    pantheon: false,
    selectedLeader: null,
  });

  const {leaders, actions, shuffleActionDeck, shuffleDeck, shuffleLeaderDeck} =
    useFilteredCards({
      agora: state.agora,
      pantheon: state.pantheon,
    });

  useEffect(() => {
    if (!leaders) return;

    leaders[leaders.length - 1]?.name &&
      selectLeader(leaders[leaders.length - 1].name);
  }, [leaders]);

  const toggleAgora = (value: boolean) => {
    dispatch({type: 'TOGGLE_AGORA', payload: value});
  };

  const togglePantheon = (value: boolean) => {
    dispatch({type: 'TOGGLE_PANTHEON', payload: value});
  };

  const selectLeader = (leader: string) => {
    dispatch({type: 'SELECT_LEADER', payload: leader});
  };

  return (
    <CardsContext.Provider
      value={{
        cards: {
          leaders,
          actions,
          shuffleDeck,
          shuffleActionDeck,
          shuffleLeaderDeck,
        },
        form: {
          useAgora: state.agora,
          usePantheon: state.pantheon,
          selectedLeader: state.selectedLeader,
          toggleAgora,
          togglePantheon,
          selectLeader,
        },
      }}>
      {children}
    </CardsContext.Provider>
  );
};

export const useCardsContext = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCardsContext must be used within a CardsProvider');
  }
  return context;
};
