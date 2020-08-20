import React, { Fragment, useState } from 'react';
import { NavigationInterface } from '../../types';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { AntDesign } from '@expo/vector-icons';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ToggleContainer, ToggleCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
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
    </Fragment>
  );
}
