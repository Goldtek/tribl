import React from 'react';
import { Button, Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
interface RecommendedCommunityProp {
  name: string;
  members: string;
  avatar: string;
  onPress(): void;
}

function RecommendedCommunity(props: RecommendedCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, members, onPress } = props;

  return (
    <Card
      onPress={() => {}}
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
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
      </Card.Content>
      <Card.Title
        title={name}
        subtitle={members}
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
            resizeMode={FastImage.resizeMode.contain}
            source={{ uri: avatar, priority: FastImage.priority.high }}
            style={{
              width: RFValue(size),
              height: RFValue(size + 2),
              borderRadius: 5
            }}
          />
        )}
        right={() => (
          <Button
            mode="text"
            onPress={onPress}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              left: 15
            }}
          >
            join
          </Button>
        )}
        style={{ flex: 1, paddingLeft: 0 }}
      />
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
