import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Title } from 'react-native-paper';
import { Container } from './styles';
import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
  GooglePlaceDetail
} from 'react-native-google-places-autocomplete';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import ENVIRONMENT_VARIABLES from '../../../config';
import { hideSensitiveView } from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

function BirthplaceModal(props: any) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const details = props.route.params?.details?.birthPlace;
  const placeholder =
    details?.state + ', ' + details?.country ||
    t(`signup.userLocationScreen.birthPlacePlaceholder`);

  const birthPlaceRef = useRef<GooglePlacesAutocomplete | null>(null);

  const [state, setState] = useState({
    locationInput: '',
    birthPlaceInput: '',
    birthPlace: {
      lat: 0,
      long: 0,
      country: '',
      state: '',
      city: ''
    }
  });

  const handleBirthLocation = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ): void => {
    // 'details' is provided when fetchDetails = true

    const address = details?.address_components.reduce(
      (acc, address) => {
        const { long_name, types } = address;

        if (types.length) {
          types.forEach((type) => {
            // this is the selected location state
            if (type === 'administrative_area_level_1') acc.state = long_name;

            // this is the selected location country
            if (type === 'country') acc.country = long_name;

            //this is the selected location city
            if (type === 'locality') acc.city = long_name;
          });
        }

        return acc;
      },
      { country: '', state: '', city: '' }
    );

    const birthPlace = {
      lat: details?.geometry.location.lat as number,
      long: details?.geometry.location.lng as number,
      country: address?.country as string,
      state: address?.state as string,
      city: address?.city as string
    };

    const { description } = data;
    setState({
      ...state,
      birthPlaceInput: description,
      birthPlace
    });
  };

  useEffect(() => {
    props.route.params?.getBirthplaceDetails(state.birthPlace);
  }, [state]);

  const handleNavigation = useCallback(() => {
    navigation.navigate('PassportScreen');
  }, []);

  return (
    <Container
      ref={hideSensitiveView}
      style={{
        height: '100%',
        paddingLeft: RFValue(20),
        paddingRight: RFValue(20)
      }}
    >
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.8)),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          marginTop: RFValue(30),
          marginBottom: RFValue(30),
          textTransform: 'capitalize'
        }}
      >
        {t(`signup.userLocationScreen.update`)}
      </Title>
      <GooglePlacesAutocomplete
        ref={birthPlaceRef}
        fetchDetails={true}
        returnKeyType="done"
        value={state.birthPlaceInput}
        suppressDefaultStyles={true}
        enablePoweredByContainer={false}
        scrollEnabled={false}
        onPress={handleBirthLocation}
        onFail={(error) => crashlytics.recordError(new Error(error))}
        GooglePlacesDetailsQuery={{ type: '(regions)' }}
        query={{
          key: ENVIRONMENT_VARIABLES.GOOGLE_PLACES_API,
          language: 'en'
        }}
        placeholder={placeholder}
        styles={{
          textInputContainer: {
            height: RFValue(50),
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
      />

      <GradientButton onPress={handleNavigation}>
        {t(`signup.identifyUserScreen.done`)}
      </GradientButton>
    </Container>
  );
}

export default React.memo(BirthplaceModal);
