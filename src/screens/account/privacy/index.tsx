import React, { Fragment, useState, useCallback } from 'react';
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

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ToggleContainer, ToggleCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [index, setIndex] = useState(Number || undefined);

  const { data } = useQuery(GET_USER_PASSPORT);

  const userDetails = data?.myPassport;
  const privacySetting = userDetails?.privacy;

  const [privacy, setPrivacy] = useState({
    identity: privacySetting?.identity,
    locality: privacySetting?.locality,
    interest: privacySetting?.interest,
    age: privacySetting?.age,
    selectedData: null
  });
  const selectedData = privacy.selectedData;
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const showPrivacyModal = useCallback(
    (isVisible: boolean, index?: any) => () => {
      setIsVisible(isVisible);
      setIndex(index);
      if (index == 0) {
        setPrivacy({
          ...privacy,
          selectedData: privacy?.identity
        });
      }
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
        locality: childData,
        selectedData: privacySetting?.locality
      });
    }
    if (index == 2) {
      setPrivacy({
        ...privacy,
        interest: childData,
        selectedData: privacySetting?.interest
      });
    }
    if (index == 3) {
      setPrivacy({
        ...privacy,
        age: childData,
        selectedData: privacySetting?.age
      });
    }
  };

  const PrivacyItems = [
    t(`community.accountSettings.identity`),
    t(`community.accountSettings.locality`),
    t(`community.accountSettings.interest`),
    t(`community.accountSettings.age`)
  ];

  return (
    <Fragment>
      <Container>
        {PrivacyItems.map((item: string, index: number) => (
          <Fragment>
            <TouchableRipple
              key={index}
              onPress={showPrivacyModal(true, index)}
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
                />
              </Fragment>
            </TouchableRipple>
            <Divider style={{ backgroundColor: colors.INPUT }} />
          </Fragment>
        ))}
        <TouchableRipple
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
        </TouchableRipple>
        <Divider style={{ backgroundColor: colors.INPUT }} />
        <TouchableRipple
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
              {t(`community.accountSettings.passport`)}
            </Text>
            <Text></Text>
            <AntDesign
              name="caretright"
              size={20}
              color={colors.PRIMARY_TEXT}
            />
          </Fragment>
        </TouchableRipple>
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
              {isEnabled
                ? t(`community.accountSettings.private`)
                : t(`community.accountSettings.public`)}
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
        selectedData={selectedData}
      />
    </Fragment>
  );
}
