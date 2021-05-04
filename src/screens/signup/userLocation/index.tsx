import React, { useState, Fragment, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
  ProgressBar,
  Title,
  Paragraph
} from 'react-native-paper';
import { Mixpanel } from '../../../config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  TouchableHighlight,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import * as Location from 'expo-location';
import { Toast } from '../../../components/rootToaster';
import { useTranslation } from 'react-i18next';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { useMutation } from '@apollo/react-hooks';
import GradientButton from '../../../components/gradientButton';
import GPSIcon from '../../../../assets/icons/gpsIcon';
import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
  GooglePlaceDetail
} from 'react-native-google-places-autocomplete';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Input from '../../../components/input';
import LoadingModal from '../../../components/loadingModal';
import ENVIRONMENT_VARIABLES from '../../../config';
import {
  tagScreenName,
  logEvent,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import Storage from '../../../libs/storage';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function UserLocationScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const birthPlaceRef = useRef<GooglePlacesAutocomplete | null>(null);

  const [state, setState] = useState({
    locationInput: '',
    birthPlaceInput: '',
    currentLocation: {
      lat: 0,
      long: 0,
      country: '',
      state: '',
      city: ''
    },
    loading: false,
    isModalVisible: false,
    isVisible: false
  });

  const handleInputError = (error: string) => {
    Toast.show(t(`signup.userLocationScreen.${error}`));
  };

  useEffect(() => {
    tagScreenName('LocationScreen');
    logEvent('get user location', { from: 'signup' });
    Mixpanel.track('User Location', {
      info: 'User on location selection screen',
      'Activity Screen': 'User Location Screen'
    });
  }, []);

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      details: {
        currentLocation: [
          { ...state.currentLocation, __typename: 'currentLocation' }
        ]
      }
    }
  });

  const handleSubmit = async () => {
    const { locationInput } = state;

    if (!locationInput) return handleInputError('inputError');

    setState({ ...state, loading: true });

    await Storage.setUserRegistration({
      route: 'SignupPassportScreen',
      user: {
        currentLocation: {
          ...state.currentLocation,
          __typename: 'currentLocation'
        }
      }
    });

    Mixpanel.people_set_once({ currentLocation: state.currentLocation });

    setTimeout(() => {
      setState({ ...state, loading: false, isModalVisible: true });
    }, 300);

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignupPassportScreen' }]
      });
      setState({ ...state, loading: false, isModalVisible: false });
      addUserDetails();
    }, 3500);
  };

  const handleLocation = async () => {
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        return handleInputError('isLocationEnabled');
      }

      const locationPermission = await Location.requestPermissionsAsync();

      if (!locationPermission.granted) {
        return handleInputError('locationPermission');
      }

      setState({ ...state, isVisible: true });

      const { coords } = await Location.getLastKnownPositionAsync();

      const [currentLocation] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      const { region, country, city } = currentLocation;

      setState({
        ...state,
        isVisible: false,
        locationInput: `${city}, ${region}, ${country}`,
        currentLocation: {
          lat: coords.latitude,
          long: coords.longitude,
          state: region,
          country,
          city
        }
      });
    } catch (error) {
      handleInputError('currentPosition');
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container
        style={{
          height: '100%',
          paddingLeft: RFValue(20),
          paddingRight: RFValue(20)
        }}
      >
        <ProgressBar
          progress={5 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: RFValue(30)
          }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="position"
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={-50}
        >
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
              color: colors.PRIMARY,
              textTransform: 'capitalize',
              lineHeight: RFValue(30)
            }}
          >
            {t(`signup.userLocationScreen.subTitle`)}
          </Title>

          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.8)),
              color: colors.PRIMARY_TEXT,
              lineHeight: RFValue(30),
              marginTop: 20
            }}
          >
            {t(`signup.userLocationScreen.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.userLocationScreen.paragraph`)}
          </Paragraph>

          <Container
            style={{ flex: 1, paddingTop: RFValue(30) }}
            ref={hideSensitiveView}
          >
            {!state.locationInput ? (
              <TouchableHighlight
                onPress={handleLocation}
                underlayColor={colors.DISABLED}
                style={{
                  width: '100%',
                  height: RFValue(70),
                  flexDirection: 'row',
                  paddingLeft: RFValue(20),
                  paddingRight: RFValue(20),
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: colors.INACTIVE,
                  marginTop: RFValue(30)
                }}
              >
                <Fragment>
                  <Container
                    style={{
                      width: RFValue(40),
                      height: RFValue(40),
                      padding: RFValue(10),
                      borderWidth: 1.2,
                      borderRadius: 4,
                      borderColor: colors.INACTIVE
                    }}
                  >
                    <GPSIcon />
                  </Container>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize',
                      marginLeft: RFValue(20)
                    }}
                  >
                    {t(`signup.userLocationScreen.setLocation`)}
                  </Title>
                </Fragment>
              </TouchableHighlight>
            ) : (
              <Container>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase',
                    marginTop: 30
                  }}
                >
                  {t(`signup.userLocationScreen.currentLocation`)}
                </Paragraph>

                <Input
                  placeholder={t(`signup.userLocationScreen.currentLocation`)}
                  value={state.locationInput}
                  returnKeyType="next"
                  editable={false}
                  textInputStyle={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR
                  }}
                />

                {/* <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase',
                    marginTop: 20
                  }}
                >
                  {t(`signup.userLocationScreen.birthPlace`)}
                </Paragraph> */}

                {/* <GooglePlacesAutocomplete
                  ref={birthPlaceRef}
                  fetchDetails={true}
                  returnKeyType="done"
                  value={state.birthPlaceInput}
                  suppressDefaultStyles={true}
                  enablePoweredByContainer={false}
                  onPress={handleBirthLocation}
                  onFail={(error) => console.error(error)}
                  GooglePlacesDetailsQuery={{ type: '(regions)' }}
                  query={{
                    key: ENVIRONMENT_VARIABLES.GOOGLE_PLACES_API,
                    language: 'en'
                  }}
                  placeholder={t(
                    `signup.userLocationScreen.birthPlacePlaceholder`
                  )}
                  styles={{
                    textInputContainer: {
                      height: RFValue(60),
                      borderRadius: 5,
                      backgroundColor: colors.WHITE,
                      borderColor: colors.INACTIVE,
                      borderWidth: 1
                    },
                    row: { paddingTop: 15, paddingBottom: 15 },
                    separator: {
                      borderColor: colors.DISABLED,
                      borderWidth: 0.5
                    },
                    description: { fontFamily: fonts.WORK_SANS_REGULAR }
                  }}
                  textInputProps={{
                    style: {
                      flex: 1,
                      color: colors.PRIMARY_TEXT,
                      paddingLeft: 20,
                      paddingRight: 20,
                      fontSize: RFValue(fonts.LARGE_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR
                    }
                  }}
                /> */}
                {/* <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                    color: colors.PRIMARY_TEXT,
                    textAlign: 'center',
                    marginTop: 10
                  }}
                >
                  {t(`signup.userLocationScreen.placePlaceholderInstruction`)}
                </Paragraph> */}
              </Container>
            )}

            <Container
              style={{
                justifyContent: 'flex-end',
                marginTop: RFValue(
                  safeAreaBottom + DEVICE_FULL_WIDTH <= 375 ? 30 : 60
                )
              }}
            >
              <GradientButton loading={state.loading} onPress={handleSubmit}>
                {t(
                  `signup.userLocationScreen.${
                    state.loading ? 'loading' : 'submit'
                  }`
                )}
              </GradientButton>
            </Container>
          </Container>
        </KeyboardAvoidingView>
      </Container>

      <Modal
        visible={state.isVisible}
        dismissable={false}
        contentContainerStyle={{
          width: RFValue(80),
          height: RFValue(80),
          borderRadius: 2,
          left: DEVICE_FULL_WIDTH / 2.5,
          backgroundColor: colors.WHITE
        }}
      >
        <ActivityIndicator
          animating={true}
          color={colors.PRIMARY}
          size={RFValue(30)}
        />
      </Modal>

      <LoadingModal
        title={t('signup.preparingPassport')}
        isVisible={state.isModalVisible}
      />
    </SafeAreaView>
  );
}
