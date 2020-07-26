import React from 'react';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import {
  CommunityContainer,
  TextConatiner,
  CardContainer,
  CardContent
} from './styles';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// DEFINE SCREEN PROP TYPES
interface PopularUserProp {
  avatar: string;
  name: string;
  members: string;
}

function PopularCommunity(props: PopularUserProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    avatar = 'https://picsum.photos/700',
    name = 'Peter Martin',
    members = 'New York, NY'
  } = props;

  return (
    <CardContainer>
      <CommunityContainer>
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
          <TouchableOpacity
            onPress={() => navigation.navigate('SingleCommunityScreen')}
          >
            <Paragraph
              style={{
                color: colors.PRIMARY,
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'uppercase',
                lineHeight: RFValue(14)
              }}
            >
              join
            </Paragraph>
          </TouchableOpacity>
        </TextConatiner>
      </CommunityContainer>
    </CardContainer>
  );
}

export default React.memo(PopularCommunity);
