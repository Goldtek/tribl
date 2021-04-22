import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { Switch, StatusBar, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import PrivacyModal from './widget';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { UPDATE_PASSPORT } from '../../../graphql/server/mutations';
import { crashlytics } from '../../../firebase/config';
import { MyPassportInterface } from '../../../graphql/types';
import Header from '../../../components/header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ToggleContainer, ToggleCover, Cover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const { top } = useSafeAreaInsets();

  const { data, refetch } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const userDetails = data?.myPassport;
  const privacySetting = userDetails?.privacy;

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [index, setIndex] = useState(Number || undefined);
  const [privacy, setPrivacy] = useState({
    identity: privacySetting?.identity,
    locality: privacySetting?.locality,
    interest: privacySetting?.interest,
    age: privacySetting?.age,
    visibility: privacySetting?.visibility
  });
  const [settingsInview, setSettingsInview] = useState();

  enum visibilityToggle {
    PRIVATE,
    PUBLIC
  }

  const [updatePassport] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        privacy: {
          visibility: privacySetting?.visibility,
          identity: privacy?.identity,
          locality: privacy?.locality,
          interest: privacy?.interest,
          age: privacy?.age
        }
      }
    }
  });

  const saveSetting = async () => {
    setLoading(true);
    try {
      const { data } = await updatePassport();
      if (data) {
        setUpdate(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
    }
  };

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
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
      setUpdate(true);
    }
    if (index == 1) {
      setPrivacy({
        ...privacy,
        locality: childData
      });
      setUpdate(true);
    }
    if (index == 2) {
      setPrivacy({
        ...privacy,
        interest: childData
      });
      setUpdate(true);
    }
    if (index == 3) {
      setPrivacy({
        ...privacy,
        age: childData
      });
      setUpdate(true);
    }
  };

  const PrivacyItems = [
    t(`community.accountSettings.identity`),
    t(`community.accountSettings.locality`),
    t(`community.accountSettings.interest`),
    t(`community.accountSettings.age`)
  ];

  useEffect(() => {
    if (userDetails) {
      setPrivacy({
        ...privacy,
        identity: privacySetting?.identity,
        locality: privacySetting?.locality,
        interest: privacySetting?.interest,
        age: privacySetting?.age,
        visibility: privacySetting?.visibility
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if (privacy.visibility == visibilityToggle[0]) {
      setIsEnabled(true);
    }
    refetch();
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
      <StatusBar translucent barStyle="dark-content" />
      <Header
        title={() => (
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.privacy`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableRipple
            onPress={() => navigation.goBack()}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40 / 2,
              marginRight: 10
            }}
          >
            <Ionicons name="md-arrow-back" size={24} color={colors.PRIMARY} />
          </TouchableRipple>
        )}
        headerRight={() => (
          <TouchableRipple
            onPress={() => (update ? saveSetting() : {})}
            rippleColor={colors.PRIMARY}
            style={{
              width: 70,
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: loading ? RFValue(40) : RFValue(15)
            }}
          >
            <Fragment>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.PRIMARY}
                  style={{
                    marginRight: RFValue(5)
                  }}
                />
              ) : null}
              <Text
                style={{
                  color: update ? colors.PRIMARY_TEXT : colors?.INACTIVE,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_MEDIUM,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.tabPanel.save`)}
              </Text>
            </Fragment>
          </TouchableRipple>
        )}
        style={{ paddingTop: top }}
      />
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
        <TouchableRipple
          onPress={() =>
            navigation.navigate('BlockedAccountScreen', {
              details: privacySetting?.blocked
            })
          }
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
            <Cover>
              {privacySetting?.blocked?.length ? (
                <Text
                  style={{
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: fonts.LARGE_SIZE,
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize'
                  }}
                >
                  {privacySetting?.blocked?.length}{' '}
                  {privacySetting?.blocked?.length > 1
                    ? t(`community.tabPanel.members`)
                    : t(`community.tabPanel.member`)}
                </Text>
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

        {/* <ToggleContainer>
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
      */}
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
