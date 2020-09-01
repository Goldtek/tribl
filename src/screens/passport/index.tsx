import React, { useState } from 'react';
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
import { useQuery, useMutation } from '@apollo/react-hooks';
// import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationInterface } from '../types';
import { useThemeContext } from '../../theme';
import TabViewSlider from './widgets/tabs';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import { MyPassportInterface } from '../../graphql/types';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
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
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function PassportScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { data: userData, refetch } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );

  const userDetails = userData?.myPassport;
  const [state, setState] = useState({
    details: {},
    loading: false
  });
  const [imageLoad, setImageLoad] = useState(true);
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
      console.error(error.message);
    }
  };

  const getUserDetails = (childData: any) => {
    setState({
      ...state,
      details: childData
    });
  };
  //@ts-ignore
  const firstName = state?.details?.firstName;
  //@ts-ignore
  const lastName = state?.details?.lastName;
  //@ts-ignore
  const dob = state?.details?.date;
  //@ts-ignore
  const identity = state?.details?.selectedIdentity || [];
  const SelectedIdentities = Array.from(identity?.values());

  const [updatePassport] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        firstName: firstName,
        lastName: lastName,
        dob: {
          formatted: dob
        },
        identity: SelectedIdentities,
        currentLocation: {
          state: userDetails?.currentLocation[0]?.state,
          country: userDetails?.currentLocation[0]?.country,
          long: userDetails?.currentLocation[0]?.long,
          lat: userDetails?.currentLocation[0]?.lat
        },
        birthPlace: {
          state: userDetails?.currentLocation[0]?.state,
          country: userDetails?.currentLocation[0]?.country,
          long: userDetails?.currentLocation[0]?.long,
          lat: userDetails?.currentLocation[0]?.lat
        }
      }
    }
  });

  const handleRequest = async () => {
    setState({
      ...state,
      loading: true
    });
    try {
      const { data } = await updatePassport();
      if (data?.updatePassport) {
        refetch();
        setState({
          ...state,
          loading: false
        });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.PRIMARY,
        paddingTop: RFValue(paddingTop)
      }}
    >
      <StatusBar translucent animated style="light" />
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
            <Button
              labelStyle={{ color: colors.WHITE }}
              onPress={handleRequest}
              loading={state.loading}
            >
              Done
            </Button>
          </Cover>
          <ImageContainer>
            <FastImage
              source={{
                uri: userDetails?.avatar,
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

            <ImageTextContainer>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE - 2),
                  paddingRight: 20,
                  lineHeight: 21,
                  color: colors.WHITE,
                  textTransform: 'capitalize'
                }}
              >
                {`${userDetails?.firstName} ${userDetails?.lastName}`}
              </Paragraph>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  paddingRight: 20,
                  lineHeight: 16,
                  color: colors.WHITE,
                  textTransform: 'capitalize'
                }}
              >
                {`${userDetails?.currentLocation[0].state} ${userDetails?.currentLocation[0].country}`}
              </Paragraph>
              <ConnectionCover>
                <Connection>
                  <Paragraph
                    style={{
                      color: colors.WHITE,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: fonts.LARGE_SIZE + 1,
                      lineHeight: 20
                    }}
                  >
                    {userDetails?.connectionCount}
                  </Paragraph>
                  <Paragraph
                    style={{
                      fontSize: fonts.MEDIUM_SIZE - 1,
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      color: colors.WHITE,
                      textTransform: 'uppercase',
                      lineHeight: 13
                    }}
                  >
                    {t(`community.memberPassport.connection`)}
                  </Paragraph>
                </Connection>
                <Connection>
                  <Paragraph
                    style={{
                      color: colors.WHITE,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: fonts.LARGE_SIZE + 1,
                      lineHeight: 20
                    }}
                  >
                    {userDetails?.communityCount}
                  </Paragraph>
                  <Paragraph
                    style={{
                      fontSize: fonts.MEDIUM_SIZE - 1,
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      color: colors.WHITE,
                      textTransform: 'uppercase',
                      lineHeight: 13
                    }}
                  >
                    {t(`community.memberPassport.community`)}
                  </Paragraph>
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
