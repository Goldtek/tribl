import React, { useCallback } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import { CommunityInterface } from '../../graphql/types';
import { hideSensitiveView } from '../../utils/uxcamHelper';
// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectedTribeProps extends CommunityInterface {}

export default function ConnectedTribe(props: ConnectedTribeProps) {
  const { colors, fonts } = useThemeContext();

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { avatar, membersCount, name } = props;

  const handleNavigation = useCallback(() => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: { ...props }
    });
  }, []);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: RFValue(DEVICE_FULL_WIDTH / 3),
        height: RFValue(180),
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        marginRight: 15,
        borderWidth: 0.5,
        borderColor: hexToRGB(colors.DISABLED, 0.3)
      }}
    >
      <Card.Content
        style={{
          width: RFValue(DEVICE_FULL_WIDTH / 3),
          height: '100%',
          alignItems: 'center',
          paddingHorizontal: RFValue(10),
          marginTop: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: '90%',
            height: RFValue(90),
            borderRadius: RFValue(4)
          }}
        />
        <TextContainer ref={hideSensitiveView}>
          <Title
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              marginTop: RFValue(10),
              marginBottom: 0,
              textTransform: 'capitalize'
            }}
          >
            {name}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginTop: 0,
              marginBottom: 0
            }}
          >
            {membersCount} {t(`community.tabPanel.members`)}
          </Paragraph>
        </TextContainer>
      </Card.Content>
    </Card>
  );
}
