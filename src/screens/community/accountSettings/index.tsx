import React, { Fragment } from 'react';
import { NavigationInterface } from '../../types';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeArea } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import { Entypo, AntDesign } from '@expo/vector-icons';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeArea();
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Fragment>
      <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
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
            {t(`community.sideNav.settings`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableRipple onPress={() => props.navigation.goBack()}>
            <Entypo name="chevron-left" size={30} color={colors.PRIMARY} />
          </TouchableRipple>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        <TouchableRipple
          onPress={() => navigation.navigate('PrivacyScreen')}
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
              {t(`community.accountSettings.privacy`)}
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
              {t(`community.accountSettings.notification`)}
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
              {t(`community.accountSettings.number`)}
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
              {t(`community.accountSettings.delete`)}
            </Text>
            <AntDesign
              name="caretright"
              size={20}
              color={colors.PRIMARY_TEXT}
            />
          </Fragment>
        </TouchableRipple>
      </Container>
    </Fragment>
  );
}
