import { StyleSheet, ImageBackground } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import backgroundImage from '~/assets/background.png';
import { cards } from '~/constants/cards';
import { randomNumbers } from '~/utils';

import { Card } from './Card';

type DeckProps = {
  numberCards: number;
};

export function Deck({ numberCards }: DeckProps) {
  const totalCards = cards.length;
  if (numberCards <= 0 || numberCards > totalCards) {
    throw new Error(`Number of cards must be between 1 and ${totalCards}`);
  }

  const shuffleBack = useSharedValue(false);

  const randomIndex = randomNumbers(totalCards, numberCards);
  const deck = cards.filter(card => randomIndex.includes(card.id));

  return (
    <ImageBackground style={styles.container} source={backgroundImage} blurRadius={2}>
      {deck.map((card, index) => (
        <Card key={String(card.id)} card={card} index={index} shuffleBack={shuffleBack} />
      ))}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110600',
  },
});
