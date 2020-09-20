import React, { Fragment, useCallback } from 'react';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularCommunityProp {
  avatar: string;
  name: string;
  membersCount: string;
  isMember: boolean;
}

function PopularCommunity(props: PopularCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { avatar, name, membersCount, isMember } = props;

  const handleNavigation = useCallback(() => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props
    });
  }, []);

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      style={{
        height: RFValue(100),
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{
            width: RFValue(90),
            height: RFValue(90),
            borderRadius: RFValue(5)
          }}
        />
        <TextContainer>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.LARGE_SIZE + 1,
              lineHeight: RFValue(20),
              textTransform: 'capitalize'
            }}
          >
            {name}
          </Title>
          <Paragraph
            style={{
              fontSize: fonts.LARGE_SIZE,
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(19),
              color: colors.SECONDARY_TEXT
            }}
          >
            {membersCount} {t(`community.tabPanel.member`)}
          </Paragraph>
          {isMember ? (
            <Paragraph
              style={{
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                lineHeight: RFValue(19),
                color: colors.PRIMARY,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.recommended.leave`)}
            </Paragraph>
          ) : (
            <Paragraph
              style={{
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                lineHeight: RFValue(19),
                color: colors.PRIMARY,
                textTransform: 'uppercase'
              }}
            >
              {t(`community.recommended.join`)}
            </Paragraph>
          )}
        </TextContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(PopularCommunity, () => false);
