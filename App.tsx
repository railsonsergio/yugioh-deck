import AppLoading from 'expo-app-loading';
import { useAssets } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';

import { Deck } from '~/components/Deck';
import { images } from '~/constants/images';

export default function App() {
  const allAssets = [...Object.values(images), require('~/assets/background.png')];
  const [assets] = useAssets(allAssets);

  if (!assets) return <AppLoading />;

  return (
    <>
      <Deck numberCards={12} />
      <StatusBar style="light" translucent />
    </>
  );
}
