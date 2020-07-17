import React, { useState, Fragment } from 'react';
import {
  ActivityIndicator,
  Modal,
  ProgressBar,
  Title,
  Paragraph
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import GradientButton from '../../../components/gradientButton';
import GPSIcon from '../../../../assets/icons/gpsIcon';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import Input from '../../../components/input';
import LoadingModal from '../../../components/loading';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function UserLocationScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const [state, setState] = useState({
    location: '',
    city: '',
    state: '',
    street: '',
    birthPlace: '',
    loading: false,
    isModalVisible: false,
    isVisible: false
  });

  const handleSubmit = () => {
    setState({ ...state, loading: true });

    setTimeout(() => {
      setState({ ...state, loading: false, isModalVisible: true });
    }, 1000);

    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'PassportScreen' }] });
      setState({ ...state, loading: false, isModalVisible: false });
    }, 5000);
  };

  const handleLocation = async () => {
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        throw new Error(
          JSON.stringify({
            key: 'isLocationEnabled',
            message: 'LOCATION SERVICE NOT ENABLED'
          })
        );
      }

      const locationPermission = await Location.requestPermissionsAsync();

      if (!locationPermission.granted) {
        throw new Error(
          JSON.stringify({
            key: 'locationPermission',
            message: 'LOCATION PERMISSION NOT GRANTED'
          })
        );
      }

      setState({ ...state, isVisible: true });

      const { coords, timestamp } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest
      });

      if (!timestamp) {
        throw new Error(
          JSON.stringify({
            key: 'currentPosition',
            message: 'NETWORK TIMEOUT TRY AGAIN'
          })
        );
      }

      const [currentLocation] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      const { city, region, street } = currentLocation;

      setState({
        ...state,
        isVisible: false,
        city,
        state: region,
        street,
        location: `${street}, ${city}, ${region}`
      });
    } catch (error) {
      console.log(JSON.parse(error.message));
    }
  };

  return (
    <Fragment>
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
            {t(`signup.screenSeven.subTitle`)}
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
            {t(`signup.screenSeven.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.screenSeven.paragraph`)}
          </Paragraph>

          <Container style={{ flex: 1, paddingTop: RFValue(30) }}>
            {!state.location ? (
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
                    {t(`signup.screenSeven.setLocation`)}
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
                  {t(`signup.screenSeven.currentLocation`)}
                </Paragraph>

                <Input
                  placeholder={t(`signup.screenSeven.currentLocation`)}
                  defaultValue={state.location}
                  returnKeyType="next"
                  editable={false}
                  textInputStyle={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR
                  }}
                />

                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase',
                    marginTop: 20
                  }}
                >
                  {t(`signup.screenSeven.birthPlace`)}
                </Paragraph>

                <Input
                  placeholder={t(`signup.screenSeven.birthPlace`)}
                  defaultValue={state.birthPlace}
                  onChangeText={(birthPlace) =>
                    setState({ ...state, birthPlace })
                  }
                  returnKeyType="next"
                  textInputStyle={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR
                  }}
                />
              </Container>
            )}

            <Container
              style={{
                justifyContent: 'flex-end',
                paddingBottom: RFValue(safeAreaBottom + 30),
                marginTop: RFValue(
                  safeAreaBottom + DEVICE_FULL_WIDTH <= 375 ? 30 : 60
                )
              }}
            >
              <GradientButton loading={state.loading} onPress={handleSubmit}>
                {t(
                  `signup.screenSeven.${state.loading ? 'loading' : 'submit'}`
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
    </Fragment>
  );
}
