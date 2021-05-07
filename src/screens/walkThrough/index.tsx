import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { StatusBar } from 'expo-status-bar';
import Slide from './widget/slide';
import { useThemeContext } from '../../theme';
import { NavigationInterface } from '../types';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import Storage from '../../libs/storage';
import { tagScreenName } from '../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function WalkThroughScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  changeNavigationBarColor(colors.SECONDARY, false, true);

  useEffect(() => {
    tagScreenName('WalkThroughScreen');
  }, []);

  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);

  const swiperRef = useRef<Swiper>(null);

  const handleSlideChange = useCallback(
    (index: number) => setCurrentSlide(index),
    []
  );

  const handleNextButton = useCallback(
    () => swiperRef.current?.scrollBy(1, true),
    []
  );

  const handleDoneButton = useCallback(async () => {
    await Storage.setInitialLaunch();
    return navigation.navigate('PreviewScreen');
  }, []);

  const renderPagination = (_index: number, total: number) => (
    <Container
      style={{
        width: DEVICE_FULL_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
      }}
    >
      {[...Array(total)].map((_, dotIndex: number) => (
        <Container
          key={dotIndex}
          style={{
            width: RFValue(30),
            height: RFValue(4),
            backgroundColor:
              dotIndex === currentSlide
                ? colors.WHITE
                : hexToRGB(colors.WHITE, 0.25),
            borderRadius: 4,
            margin: 5
          }}
        />
      ))}

      {currentSlide !== 2 && (
        <Button
          mode="text"
          color={colors.WHITE}
          uppercase={false}
          onPress={handleNextButton}
          labelStyle={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            textTransform: 'capitalize'
          }}
          style={{ position: 'absolute', right: 0, bottom: 12 }}
        >
          {t('walkThrough.nextWalkThrough')}
        </Button>
      )}
    </Container>
  );

  return (
    <GradientContainer colors={[colors.PRIMARY, colors.SECONDARY]}>
      <StatusBar translucent animated style="light" />
      <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <Container style={{ height: '5%', alignItems: 'flex-end' }}>
          {currentSlide !== 2 && (
            <Button
              mode="text"
              color={colors.WHITE}
              uppercase={false}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              onPress={() => swiperRef.current?.scrollBy(2, true)}
            >
              {t('walkThrough.skipWalkThrough')}
            </Button>
          )}
        </Container>

        <Swiper
          ref={swiperRef}
          loop={false}
          bounces={true}
          showsPagination={currentSlide !== 2 ? true : false}
          onIndexChanged={handleSlideChange}
          renderPagination={renderPagination}
        >
          {[...Array(3)].map((_, slideIndex) => (
            <Slide
              t={t}
              key={slideIndex}
              slideIndex={slideIndex}
              handleDoneButton={handleDoneButton}
              {...props}
            />
          ))}
        </Swiper>
      </SafeAreaView>
    </GradientContainer>
  );
}
