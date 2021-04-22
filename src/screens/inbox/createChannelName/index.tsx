import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName } from '../../../utils/uxcamHelper';
import Input from '../../../components/input';
import GradientButton from '../../../components/gradientButton';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderContainer,
  HeaderTitle,
  TribeContainer,
  Cover,
  TopCover,
  PrivateCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreateChannelTribeScreen(props: ScreenProp) {
  const { navigation, route } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { name, id, avatar } = route?.params;

  const [channelName, setChannelName] = useState('');

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    tagScreenName('CreateChannelNameScreen');
  }, []);

  const handleNavigation = () => {
    navigation.navigate('CreateChannelParticipant', {
      id,
      name,
      channelName,
      privateStatus: isEnabled
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RFValue(40 / 2)
            }}
          >
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
          <HeaderTitle> {t(`community.chat.createChannel`)}</HeaderTitle>
        </HeaderContainer>
        <Cover>
          <TopCover>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                color: colors.SECONDARY_TEXT,
                textAlign: 'center',
                paddingHorizontal: RFValue(10),
                marginBottom: RFValue(20)
              }}
            >
              {t(`community.chat.channelText`)}
            </Text>
            <TribeContainer>
              <FastImage
                resizeMode={FastImage.resizeMode.stretch}
                source={{
                  uri: avatar,
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                  borderRadius: 4
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                  color: colors.PRIMARY_TEXT,
                  marginLeft: RFValue(10)
                }}
              >
                {name}
              </Text>
            </TribeContainer>
            <PrivateCover>
              <Title
                style={{
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 3),
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {isEnabled
                  ? t(`community.createTribe.private`)
                  : t(`community.createTribe.public`)}
              </Title>
              <Switch
                trackColor={{ false: colors.DISABLED, true: colors.ONLINE }}
                thumbColor={colors.WHITE}
                ios_backgroundColor={colors.DISABLED}
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </PrivateCover>

            <Input
              placeholder={t(`community.chat.channelNamePlaceholder`)}
              defaultValue={channelName}
              onChangeText={(channelName) => setChannelName(channelName)}
              textInputStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR
              }}
              contanierStyle={{ height: RFValue(40) }}
            />
          </TopCover>
          <GradientButton
            style={{ height: 50 }}
            onPress={channelName?.length ? handleNavigation : () => {}}
            contentStyle={{ height: 50 }}
            gradientContainerstyle={{
              height: 50,
              marginTop: RFValue(15),
              opacity: channelName?.length ? 1 : 0.7
            }}
          >
            {t(`community.chat.next`)}
          </GradientButton>
        </Cover>
      </Container>
    </SafeAreaView>
  );
}
