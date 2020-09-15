import React, { Fragment, useCallback } from 'react';
import { Button, Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';

// DEFINE SCREEN PROP TYPES
interface RecommendedCommunityProp {
  name: string;
  membersCount: string;
  avatar: string;
  onPress(): void;
  isMember: boolean;
}

function RecommendedCommunity(props: RecommendedCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { avatar, name, membersCount, onPress, isMember } = props;

  const handleNavigation = useCallback(() => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props
    });
  }, []);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: '100%',
        height: RFValue(300),
        alignItems: 'center',
        backgroundColor: colors.GREY,
        marginTop: 3,
        elevation: 0
      }}
    >
      <Card.Content
        style={{
          width: DEVICE_FULL_WIDTH - 30,
          height: RFValue(230),
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 4
          }}
        />
      </Card.Content>
      <Card.Title
        title={name}
        subtitle={`${membersCount} ${t(`community.tabPanel.member`)}`}
        titleStyle={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          textTransform: 'capitalize',
          color: colors.PRIMARY_TEXT,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0
        }}
        subtitleStyle={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE),
          textTransform: 'capitalize',
          color: colors.SECONDARY_TEXT,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0
        }}
        left={({ size }) => (
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: avatar, priority: FastImage.priority.high }}
            style={{
              width: RFValue(size + 2),
              height: RFValue(size + 2),
              borderRadius: 5
            }}
          />
        )}
        right={() => (
          <Fragment>
            {isMember ? (
              <Button
                mode="text"
                onPress={() => {}}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  left: 15
                }}
              >
                {t(`community.recommended.leave`)}
              </Button>
            ) : (
              <Button
                mode="text"
                onPress={onPress}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  left: 15
                }}
              >
                {t(`community.recommended.join`)}
              </Button>
            )}
          </Fragment>
        )}
        style={{ flex: 1, paddingLeft: 0 }}
      />
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
