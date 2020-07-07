import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { StatusBar } from 'expo-status-bar';
import Slide from './widget/slide';
import { useThemeContext } from '../../theme';
import { NavigationInterface } from '../types';
import hexToRGB from '../../utils/hexToRGB';
import { DEVICE_FULL_WIDTH } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Container } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { USER_FIRST_LAUNCH } from '../../constants';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function WalkThroughScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);

  const swiperRef = useRef<any>(null);

  const handleSlideChange = (index: number) => setCurrentSlide(index);

  const handleNextButton = () => swiperRef.current.scrollBy(1, true);

  const handleDoneButton = async () => {
    await AsyncStorage.setItem(USER_FIRST_LAUNCH, '1');
    return props.navigation.replace('SignupScreen');
  };

  const renderPagination = (_index: number, total: number) => {
    return (
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

        {currentSlide !== 3 && (
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
  };

  return (
    <GradientContainer colors={[colors.PRIMARY, colors.SECONDARY]}>
      <StatusBar translucent />
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Container style={{ height: '5%', alignItems: 'flex-end' }}>
          {currentSlide !== 3 && (
            <Button
              mode="text"
              color={colors.WHITE}
              uppercase={false}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              onPress={() => swiperRef.current.scrollBy(3, true)}
            >
              {t('walkThrough.skipWalkThrough')}
            </Button>
          )}
        </Container>

        <Swiper
          ref={swiperRef}
          loop={false}
          bounces={true}
          showsPagination={currentSlide !== 3 ? true : false}
          onIndexChanged={handleSlideChange}
          renderPagination={renderPagination}
        >
          {[...Array(4)].map((_, slideIndex) => (
            <Slide
              key={slideIndex}
              {...{ t, slideIndex, handleDoneButton, ...props }}
            />
          ))}
        </Swiper>
      </SafeAreaView>
    </GradientContainer>
  );
}
