import React, { Fragment, useState, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import { AntDesign } from '@expo/vector-icons';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import PrivacyModal from './widget';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ToggleContainer, ToggleCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState({
    value: ''
  });
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const showPrivacyModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);
      return true;
    },
    []
  );

  const getText = (childData: any) => {
    setText({
      ...text,
      value: childData
    });
  };

  return (
    <Fragment>
      <Container>
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
              {t(`community.accountSettings.identity`)}
            </Text>
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
              {t(`community.accountSettings.locality`)}
            </Text>
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
              {t(`community.accountSettings.interest`)}
            </Text>
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
              {t(`community.accountSettings.age`)}
            </Text>
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
              {t(`community.accountSettings.link`)}
            </Text>
            <AntDesign
              name="caretright"
              size={20}
              color={colors.PRIMARY_TEXT}
            />
          </Fragment>
        </TouchableRipple>
        <Divider style={{ backgroundColor: colors.INPUT }} />
        <TouchableRipple
          onPress={showPrivacyModal(true)}
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
            <Text>{text.value}</Text>
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
        parentCallback={getText}
      />
    </Fragment>
  );
}
