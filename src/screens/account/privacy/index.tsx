import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { AntDesign } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import PrivacyModal from './widget';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { UPDATE_PASSPORT } from '../../../graphql/server/mutations';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ToggleContainer, ToggleCover, Cover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery(GET_USER_PASSPORT);
  const userDetails = data?.myPassport;
  const privacySetting = userDetails?.privacy;

  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [index, setIndex] = useState(Number || undefined);
  const [privacy, setPrivacy] = useState({
    identity: privacySetting?.identity,
    locality: privacySetting?.locality,
    interest: privacySetting?.interest,
    age: privacySetting?.age,
    name: null,
    visibility: privacySetting?.visibility
  });
  const [settingsInview, setSettingsInview] = useState();

  enum visibilityToggle {
    PRIVATE,
    PUBLIC
  }

  const identities = userDetails?.identity.map((item: any) => item.id);

  const [updatePassport] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        dob: userDetails?.dob,
        identity: identities,
        privacy: {
          visibility: privacy.visibility,
          identity: privacySetting?.identity,
          locality: privacySetting?.locality,
          interest: privacySetting?.interest,
          age: privacySetting?.age
        },
        currentLocation: {
          state: userDetails?.currentLocation[0].state,
          country: userDetails?.currentLocation[0].country,
          long: userDetails?.currentLocation[0].long,
          lat: userDetails?.currentLocation[0].lat
        },
        birthPlace: {
          state: userDetails?.currentLocation[0].state,
          country: userDetails?.currentLocation[0].country,
          long: userDetails?.currentLocation[0].long,
          lat: userDetails?.currentLocation[0].lat
        }
      }
    }
  });

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    try {
      const { data } = await updatePassport();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const showPrivacyModal = useCallback(
    (isVisible: boolean, index?: any, item?: any) => () => {
      setIsVisible(isVisible);
      setIndex(index);
      setSettingsInview(item);
      return true;
    },
    []
  );

  const getPrivacySetting = (childData: any) => {
    if (index == 0) {
      setPrivacy({
        ...privacy,
        identity: childData
      });
    }
    if (index == 1) {
      setPrivacy({
        ...privacy,
        locality: childData
      });
    }
    if (index == 2) {
      setPrivacy({
        ...privacy,
        interest: childData
      });
    }
    if (index == 3) {
      setPrivacy({
        ...privacy,
        age: childData
      });
    }
  };

  const PrivacyItems = [
    t(`community.accountSettings.identity`),
    t(`community.accountSettings.locality`),
    t(`community.accountSettings.interest`),
    t(`community.accountSettings.age`)
  ];

  useEffect(() => {
    if (privacy.visibility == visibilityToggle[0]) {
      setIsEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (isEnabled) {
      setPrivacy({
        ...privacy,
        visibility: visibilityToggle[0]
      });
    } else {
      setPrivacy({
        ...privacy,
        visibility: visibilityToggle[1]
      });
    }
  }, [isEnabled]);

  return (
    <Fragment>
      <Container>
        {PrivacyItems.map((item: string, index: number) => (
          <Fragment>
            <TouchableRipple
              key={index}
              onPress={showPrivacyModal(true, index, item)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: RFValue(50),
                paddingHorizontal: RFValue(25)
              }}
            >
              <Fragment>
                <Text
                  style={{
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: fonts.LARGE_SIZE,
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize'
                  }}
                >
                  {item}
                </Text>
                <Cover>
                  {item == 'identity' ? (
                    <Text>{privacy.identity}</Text>
                  ) : item == 'locality' ? (
                    <Text>{privacy.locality}</Text>
                  ) : item == 'interest' ? (
                    <Text>{privacy.interest}</Text>
                  ) : item == 'age' ? (
                    <Text>{privacy.age}</Text>
                  ) : null}
                  <AntDesign
                    name="caretright"
                    size={20}
                    color={colors.PRIMARY_TEXT}
                    style={{ paddingLeft: RFValue(30) }}
                  />
                </Cover>
              </Fragment>
            </TouchableRipple>
            <Divider style={{ backgroundColor: colors.INPUT }} />
          </Fragment>
        ))}
        {/* <TouchableRipple
          onPress={() => {}}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: RFValue(50),
            paddingHorizontal: RFValue(25)
          }}
        >
          <Fragment>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.accountSettings.blocked`)}
            </Text>
            <Text></Text>
            <AntDesign
              name="caretright"
              size={20}
              color={colors.PRIMARY_TEXT}
            />
          </Fragment>
        </TouchableRipple> */}
        <Divider style={{ backgroundColor: colors.INPUT }} />

        <ToggleContainer>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.passport`)}
          </Text>
          <ToggleCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginRight: RFValue(20)
              }}
            >
              {privacy.visibility == null
                ? t(`community.accountSettings.public`)
                : privacy.visibility}
            </Text>
            <Switch
              trackColor={{ false: colors.DISABLED, true: colors.ONLINE }}
              thumbColor={colors.WHITE}
              ios_backgroundColor={colors.DISABLED}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </ToggleCover>
        </ToggleContainer>
      </Container>

      <PrivacyModal
        closePrivacyModal={showPrivacyModal(false)}
        isVisible={isVisible}
        privacyValue={getPrivacySetting}
        index={index}
        inView={settingsInview}
        privacyValues={privacy}
      />
    </Fragment>
  );
}
