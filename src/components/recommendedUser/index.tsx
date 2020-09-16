import React, { useState, useCallback } from 'react';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import { REQUEST_CONNECTION } from '../../graphql/server/mutations';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, AvatarContainer } from './styles';
import { PassportInterface } from '../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface RecommendedUserProp extends PassportInterface {
  index: number;
  lastChild: number;
}

export default function RecommendedUser(props: RecommendedUserProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const {
    id,
    avatar,
    firstName,
    lastName,
    currentLocation,
    lastChild,
    index,
    phoneNumber,
    connected,
    conversation
  } = props;

  if (!currentLocation.length) return null;

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const handleRequest = async () => {
    setLoading(true);
    try {
      const { data } = await requestConnection();
      if (data?.requestConnection) {
        setLoading(false);
        setPending(true);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMessageNavigation = useCallback(
    () =>
      navigation.navigate(
        conversation?.id ? 'DirectChatScreen' : 'ConnectionChatScreen',
        {
          title: `${firstName} ${lastName}`,
          avatar,
          receiverId: id,
          chatId: conversation?.id
        }
      ),
    []
  );

  const handleNavigation = useCallback(() => {
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...props }
    });
  }, []);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: RFValue(DEVICE_FULL_WIDTH / 3),
        height: RFValue(200),
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        marginRight: index === lastChild ? 0 : 15,
        borderWidth: 0.5,
        borderColor: hexToRGB(colors.DISABLED, 0.3)
      }}
    >
      <Card.Content
        style={{
          width: RFValue(DEVICE_FULL_WIDTH / 3),
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <AvatarContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: RFValue(70)
            }}
          />
        </AvatarContainer>
        <TextContainer>
          <Title
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              lineHeight: 20,
              marginTop: 0,
              marginBottom: 0,
              paddingHorizontal: 10
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          <Paragraph
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginTop: 0,
              marginBottom: 0
            }}
          >
            {`${currentLocation[0]?.state}, ${currentLocation[0]?.country}`}
          </Paragraph>
        </TextContainer>
        {connected == 'PENDING' || pending ? (
          <Button
            disabled={true}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY_TEXT
            }}
            contentStyle={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: colors.DISABLED
            }}
            style={{ borderRadius: 5 }}
          >
            {t(`community.recommended.pending`)}
          </Button>
        ) : connected == 'CONNECTED' || connected == 'ACCEPTED' ? (
          <Button
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: colors.PRIMARY
            }}
            style={{ borderRadius: 5 }}
            onPress={handleMessageNavigation}
          >
            {t(`community.recommended.message`)}
          </Button>
        ) : (
          <Button
            loading={loading}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: colors.PRIMARY
            }}
            style={{ borderRadius: 5 }}
            onPress={handleRequest}
          >
            {t(`community.recommended.add`)}+
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}
