import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

type FontType = { [name: string]: Font.FontSource };

export default async function AppLoading() {
  const cacheImages = (images: number[]) => {
    return images.map((image) => {
      return typeof image === 'string'
        ? Image.prefetch(image)
        : Asset.fromModule(image).downloadAsync();
    });
  };

  const cacheFonts = (fonts: FontType[]) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  const imageAssets = cacheImages([
    require('../../../assets/images/splash.png')
  ]);

  const fontAssets = cacheFonts([
    {
      workSansRegular: require('../../../assets/fonts/WorkSans-Regular.ttf')
    },
    {
      workSansMedium: require('../../../assets/fonts/WorkSans-Medium.ttf')
    },
    {
      workSansSemiBold: require('../../../assets/fonts/WorkSans-SemiBold.ttf')
    },
    {
      workSansBold: require('../../../assets/fonts/WorkSans-Bold.ttf')
    }
  ]);

  return Promise.all([...imageAssets, ...fontAssets]);
}
