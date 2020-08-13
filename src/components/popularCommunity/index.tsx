import React, { Fragment } from 'react';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';

// IMPORT FOR ALL CUSTOM STYLES
import { TextConatiner } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularUserProp {
  avatar: string;
  name: string;
  members: string;
}

function PopularCommunity(props: PopularUserProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    avatar = 'https://picsum.photos/700',
    name = 'Black lives matter',
    members = '24k'
  } = props;

  const handleNavigation = () =>
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      avatar: avatar,
      members: members
    });

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{ height: RFValue(100), flexDirection: 'row', paddingLeft: 15 }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(100),
            height: RFValue(100),
            borderRadius: RFValue(15)
          }}
        />
        <TextConatiner>
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
            {members}
          </Paragraph>
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
        </TextConatiner>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(PopularCommunity, () => false);
