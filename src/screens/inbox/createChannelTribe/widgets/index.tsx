import React, { Fragment } from 'react';
import { Title, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { CommunityInterface } from '../../../../graphql/types';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface TribeCardProp extends CommunityInterface {}

function TribeCard(props: TribeCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const { id, avatar, name, isModerator } = props;

  const handleNavigation = async () => {
    navigation.navigate('CreateChannelNameScreen', {
      id,
      avatar,
      name,
      isModerator
    });
  };

  return (
    <TouchableRipple
      ref={hideSensitiveView}
      style={{
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20)
      }}
      rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
      onPress={handleNavigation}
    >
      <Fragment>
        {avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require('../../../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        )}
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              textTransform: 'capitalize',
              lineHeight: RFValue(18)
            }}
          >
            {name}
          </Title>
        </NameContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(TribeCard);
