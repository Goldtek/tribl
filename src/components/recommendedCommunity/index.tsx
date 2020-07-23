import React from 'react';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, OnlineNotifier, AvatarContainer } from './styles';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
interface RecommendedCommunityProp {
  avatar: string;
  name: string;
  address: string;
}

function RecommendedCommunity(props: RecommendedCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    avatar = 'https://picsum.photos/700',
    name = 'Peter Martin',
    address = 'New York, NY'
  } = props;

  return (
    <Card
      onPress={() => {}}
      style={{
        width: RFValue(DEVICE_FULL_WIDTH / 3),
        height: RFValue(200),
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 8,
        marginRight: 8
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
          <OnlineNotifier />
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
              marginBottom: 0
            }}
          >
            {name}
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
            {address}
          </Paragraph>
        </TextContainer>
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
          onPress={() => {}}
        >
          Add+
        </Button>
      </Card.Content>
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
