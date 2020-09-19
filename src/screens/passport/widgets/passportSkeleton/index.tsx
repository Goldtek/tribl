import React, { useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import { Share, ScrollView, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next';
import {
  Title,
  Paragraph,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
// import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../../theme';
import TabViewSlider from '../tabs';
// IMPORT FOR ALL CUSTOM STYLES
import {
  HeaderContainer,
  ImageContainer,
  ImageTextContainer,
  Connection,
  ConnectionCover,
  Cover
  // ImageIconContainer,
  // SocialMediaButton
} from '../../styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp {}

export default function PassportSkeleton(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { top: paddingTop } = useSafeAreaInsets();

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
      Sentry.captureException(error);
    }
  };
  const [state, setState] = useState({ details: {}, loading: false });
  const getUserDetails = (childData: any) => {
    setState({
      ...state,
      details: childData
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.PRIMARY,
        paddingTop: RFValue(paddingTop)
      }}
    >
      <StatusBar translucent animated style="dark" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: colors.WHITE,
          marginTop: RFValue(20),
          paddingBottom: RFValue(20)
        }}
      >
        <HeaderContainer>
          <Cover>
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
            <Button labelStyle={{ color: colors.WHITE }}>Done</Button>
          </Cover>
          <ImageContainer>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item margin={10}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={120}
                  justifyContent="center"
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

            <ImageTextContainer>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  paddingRight: 20,
                  marginTop: RFValue(30),
                  lineHeight: 16,
                  color: colors.WHITE,
                  textTransform: 'capitalize'
                }}
              >
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      width={200}
                      height={10}
                      borderRadius={2}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </Paragraph>
              <ConnectionCover>
                <Connection>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item alignItems="center">
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={10}
                        borderRadius={4}
                      />
                      <SkeletonPlaceholder.Item
                        marginTop={6}
                        width={90}
                        height={10}
                        borderRadius={4}
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </Connection>
                <Connection>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item alignItems="center">
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={10}
                        borderRadius={4}
                      />
                      <SkeletonPlaceholder.Item
                        marginTop={6}
                        width={90}
                        height={10}
                        borderRadius={4}
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </Connection>
              </ConnectionCover>

              {/* <ImageIconContainer>
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
        <TabViewSlider getUserDetails={getUserDetails} />
      </ScrollView>
    </SafeAreaView>
  );
}
