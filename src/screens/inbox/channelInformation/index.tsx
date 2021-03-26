import React, { Fragment, useEffect, useState } from 'react';
import { NavigationInterface } from '../../types';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import SingleImage from '../../../libs/react-native-zoom-lightbox';
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign, Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { Mixpanel } from '../../../config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, LeftCover, RightCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelInformationProp extends NavigationInterface {}

export default function ChannelInformation(props: MyChannelInformationProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('ChannelInformationScreen');
    Mixpanel.track('Channel Information', {
      info: `User views channel information`,
      'Activity Screen': 'Channel Information Screen'
    });
  }, []);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <Container>
      <SingleImage
        uri={'xfgchj'}
        style={{
          width: RFValue(110),
          height: RFValue(110),
          borderRadius: 80,
          borderWidth: 4,
          marginTop: RFValue(35),
          marginBottom: RFValue(5),
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize',
          textAlign: 'center',
          marginBottom: RFValue(15)
        }}
      >
        General
      </Text>
      <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(60)
        }}
      >
        <Fragment>
          <LeftCover>
            <Ionicons
              name="ios-notifications-outline"
              size={25}
              color={colors.PRIMARY}
              style={{ paddingRight: RFValue(10) }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.chat.mute`)}
            </Text>
          </LeftCover>
          <RightCover>
            <Switch
              trackColor={{ false: colors.DISABLED, true: colors.PRIMARY }}
              thumbColor={colors.WHITE}
              ios_backgroundColor={colors.DISABLED}
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </RightCover>
        </Fragment>
      </TouchableRipple>
      <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(60)
        }}
      >
        <Fragment>
          <LeftCover>
            <Feather
              name="users"
              size={20}
              color={colors.PRIMARY}
              style={{ paddingRight: RFValue(10) }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.chat.members`)}
            </Text>
          </LeftCover>
          <RightCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                paddingRight: RFValue(10)
              }}
            >
              2
            </Text>
            <AntDesign name="right" size={20} color={colors.PRIMARY_TEXT} />
          </RightCover>
        </Fragment>
      </TouchableRipple>
      <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(60)
        }}
      >
        <LeftCover>
          <Entypo
            name="log-out"
            size={20}
            color={colors.RED}
            style={{ paddingRight: RFValue(10) }}
          />
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.chat.leaveChannel`)}
          </Text>
        </LeftCover>
      </TouchableRipple>
      <Divider style={{ backgroundColor: colors.INPUT }} />
    </Container>
  );
}
