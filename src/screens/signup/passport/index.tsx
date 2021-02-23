import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import FastImage from 'react-native-fast-image';
import { Share, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Title,
  Paragraph,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { RegistrationInfo, StoreInterface } from '../../../graphql/types';
import { useQuery } from '@apollo/react-hooks';
// import { FontAwesome } from '@expo/vector-icons';
import TabViewSlider from './widgets/tabs';
import Storage from '../../../libs/storage';
import {
  tagScreenName,
  logEvent,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  HeaderContainer,
  ImageContainer,
  ImageTextContainer
  // ImageIconContainer,
  // SocialMediaButton
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function PassportScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [imageLoad, setImageLoad] = useState(true);
  const [userRegInfo, setUserRegInfo] = useState<RegistrationInfo | null>(null);

  useEffect(() => {
    (async () => {
      const storageData = await Storage.getUserRegistration();

      if (storageData) {
        const regInfo = JSON.parse(storageData) as RegistrationInfo;
        setUserRegInfo({ ...userRegInfo, ...regInfo });
      }
    })();
  }, []);

  useEffect(() => {
    tagScreenName('SignupPassportScreen');
    logEvent('review passport', { from: 'signup' });
  }, []);

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);

  const userDetails = data?.userDetails;

  const onShare = async () => {
    try {
      const { action } = await Share.share(
        {
          title: t(`signup.passportScreen.title`),
          message: t(`signup.passportScreen.sharePassportMessage`)
        },
        { dialogTitle: t(`signup.passportScreen.title`) }
      );

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      crashlytics.recordError(new Error(error));
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
            {t(`signup.passportScreen.title`)}
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
            {t(`signup.passportScreen.subTitle`)}
          </Paragraph>

          <ImageContainer ref={hideSensitiveView}>
            <FastImage
              source={{
                uri: userRegInfo?.user?.avatar || userDetails?.avatar,
                priority: FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
              onLoadEnd={() => setImageLoad(false)}
              style={{
                width: RFValue(120),
                height: RFValue(120),
                justifyContent: 'center',
                borderRadius: 4
              }}
            >
              {imageLoad && (
                <ActivityIndicator
                  animating={true}
                  size={RFValue(50)}
                  color={colors.WHITE}
                />
              )}
            </FastImage>

            <ImageTextContainer ref={hideSensitiveView}>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  paddingRight: 20,
                  lineHeight: 21,
                  color: colors.WHITE
                }}
              >
                {`${userRegInfo?.user?.firstName || userDetails?.firstName} ${
                  userRegInfo?.user?.lastName || userDetails?.lastName
                }`}
              </Paragraph>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  paddingRight: 20,
                  lineHeight: 21,
                  color: colors.WHITE
                }}
              >
                {`${
                  userDetails?.currentLocation[0]?.city ||
                  userRegInfo?.user?.currentLocation?.city
                }, ${
                  userDetails?.currentLocation[0]?.state ||
                  userRegInfo?.user?.currentLocation?.state
                }`}
              </Paragraph>
              {/* 
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
            */}
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
            contentStyle={{
              height: RFValue(55),
              backgroundColor: colors.PRIMARY_LIGHT
            }}
            style={{
              width: '100%',
              height: RFValue(55),
              marginTop: RFValue(10)
            }}
            onPress={onShare}
          >
            {t(`signup.passportScreen.sharePassport`)}
          </Button>
        </HeaderContainer>
        <TabViewSlider />
      </ScrollView>
    </SafeAreaView>
  );
}
