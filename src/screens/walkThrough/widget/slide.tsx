import React, { Fragment } from 'react';
import { Image } from 'react-native';
import { Button, Title, Subheading } from 'react-native-paper';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import hexToRGB from '../../../utils/hexToRGB';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Cover } from '../styles';
import { TFunction } from 'i18next';

// DEFINE SCREEN PROP TYPES
interface SlideProp extends NavigationInterface {
  t: TFunction;
  slideIndex: number;
  handleDoneButton(): void;
}

const TEXT_MAPPER = ['screenOne', 'screenTwo', 'screenThree', 'screenFour'];

function Slide(props: SlideProp) {
  const { t, slideIndex, handleDoneButton } = props;
  const { colors, fonts } = useThemeContext();

  return (
    <Fragment>
      <Container style={{ flex: 1 }}>
        {slideIndex === 0 && (
          <Cover>
            <Image
              source={require('../../../../assets/images/sliderTwoImage2.png')}
              style={{
                resizeMode: 'cover',
                width: '50%',
                height: RFPercentage(50)
              }}
            />
            <Image
              source={require('../../../../assets/images/sliderTwoImage.png')}
              style={{
                resizeMode: 'cover',
                width: '50%',
                height: RFPercentage(50)
              }}
            />
          </Cover>
        )}
        {slideIndex === 1 && (
          <Image
            source={require('../../../../assets/images/sliderThreeImage.png')}
            style={{
              resizeMode: 'cover',
              width: '100%',
              height: RFPercentage(50)
            }}
          />
        )}
        {slideIndex === 2 && (
          <Image
            source={require('../../../../assets/images/sliderFiveImage.png')}
            style={{
              resizeMode: 'cover',
              width: '100%',
              height: RFPercentage(50)
            }}
          />
        )}
      </Container>

      {/* REDUCE CONTENT HEIGHT FOR SCREENS LESS THAN 375 (IPHONE 8 DOWN) */}
      <Container
        style={{
          height: RFPercentage(DEVICE_FULL_WIDTH <= 375 ? 32 : 32),
          justifyContent: 'space-between'
        }}
      >
        <Container>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.5)),
              color: colors.WHITE,
              lineHeight: RFValue(30),
              textAlign: 'center',
              textTransform: 'capitalize',
              paddingTop: 0,
              marginTop: 0
            }}
          >
            {t(`walkThrough.${TEXT_MAPPER[slideIndex]}.title`)}
          </Title>

          <Subheading
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE - 1),
              color: hexToRGB(colors.WHITE, 0.7),
              textAlign: 'center'
            }}
          >
            {t(`walkThrough.${TEXT_MAPPER[slideIndex]}.subTitle`)}
          </Subheading>
        </Container>

        {slideIndex === 2 && (
          <Button
            mode="contained"
            color={colors.WHITE}
            uppercase={false}
            labelStyle={{
              color: colors.PRIMARY,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              padding: RFValue(6),
              textTransform: 'capitalize'
            }}
            contentStyle={{ width: RFPercentage(42), borderRadius: 4 }}
            style={{ marginBottom: RFValue(40) }}
            onPress={handleDoneButton}
          >
            {t('walkThrough.getStarted')}
          </Button>
        )}
      </Container>
    </Fragment>
  );
}

export default React.memo(Slide, () => false);
