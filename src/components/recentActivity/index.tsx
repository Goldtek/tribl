import React, { Fragment } from 'react';
import { Button, TouchableRipple, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Time,
  TextContainer,
  OnlineNotifier,
  AvatarContainer,
  ActivityTimeContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface RecentActivityProp {
  name: string;
  action: string;
  avatar: string;
  date: string;
}

function RecentActivity(props: RecentActivityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    avatar = 'https://picsum.photos/700',
    name = 'Peter Martin',
    action = 'sent money to Uche Nnadi',
    date = '2 min ago'
  } = props;

  return (
    <TouchableRipple
      onPress={() => {}}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      style={{
        width: '100%',
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Fragment>
        <AvatarContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: 5
            }}
          />
          <OnlineNotifier />
        </AvatarContainer>

        <TextContainer>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE - 2)),
              color: colors.PRIMARY_TEXT,
              marginTop: 0,
              marginBottom: 0
            }}
          >
            {name}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(Math.ceil(fonts.MEDIUM_SIZE)),
              color: colors.PRIMARY_TEXT,
              marginTop: 0,
              marginBottom: 0
            }}
          >
            {action}
          </Paragraph>
        </TextContainer>

        <ActivityTimeContainer>
          <Time>{date}</Time>
        </ActivityTimeContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(RecentActivity);
