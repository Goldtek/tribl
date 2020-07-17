import React from 'react';
import { SafeAreaView, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Title, Paragraph, Subheading, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { FontAwesome } from '@expo/vector-icons';
import TabViewSlider from './widgets/tabs';

// IMPORT FOR ALL CUSTOM STYLES
import {
  HeaderContainer,
  ImageContainer,
  ImageTextContainer,
  ImageIconContainer,
  SocialMediaButton
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function PassportScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const onShare = async () => {
    try {
      const { action } = await Share.share({
        message: 'Share your Tribl passport'
      });

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <StatusBar translucent style="light" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: colors.WHITE }}
      >
        <HeaderContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
              color: colors.WHITE,
              textTransform: 'capitalize',
              lineHeight: RFValue(30)
            }}
          >
            {t(`signup.screenEight.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE - 1),
              color: colors.WHITE,
              marginTop: RFValue(10),
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.screenEight.subTitle`)}
          </Paragraph>

          <ImageContainer>
            <Image
              source={{
                uri: 'https://randomuser.me/api/portraits/men/75.jpg'
              }}
              style={{
                width: RFValue(120),
                height: RFValue(120),
                resizeMode: 'cover',
                borderRadius: 4
              }}
            />

            <ImageTextContainer>
              <Subheading
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.WHITE
                }}
              >
                Kamilah Wells
              </Subheading>

              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.WHITE
                }}
              >
                Atlanta, GA
              </Paragraph>

              <ImageIconContainer>
                <SocialMediaButton
                  onPress={() => console.log('Pressed')}
                  underlayColor={colors.DISABLED}
                >
                  <FontAwesome
                    name="spotify"
                    size={RFValue(30)}
                    color={colors.WHITE}
                  />
                </SocialMediaButton>
                <SocialMediaButton
                  onPress={() => console.log('Pressed')}
                  underlayColor={colors.DISABLED}
                >
                  <FontAwesome
                    name="instagram"
                    size={RFValue(30)}
                    color={colors.WHITE}
                  />
                </SocialMediaButton>
              </ImageIconContainer>
            </ImageTextContainer>
          </ImageContainer>

          <Button
            icon={{
              uri: 'https://img.icons8.com/ios-filled/96/000000/share-3.png'
            }}
            mode="text"
            color={colors.WHITE}
            uppercase={false}
            loading={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
            contentStyle={{ height: RFValue(55), backgroundColor: '#8DA4FF' }}
            style={{
              width: '100%',
              height: RFValue(55),
              marginTop: RFValue(10)
            }}
            onPress={onShare}
          >
            {t(`signup.screenEight.sharePassport`)}
          </Button>
        </HeaderContainer>
        <TabViewSlider />
      </ScrollView>
    </SafeAreaView>
  );
}
