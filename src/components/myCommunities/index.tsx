import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { CommunityInterface, MyPassportInterface } from '../../graphql/types';
import {
  GET_COMMUNITY_CHANNELS,
  GET_COMMUNITY_MEMBERS,
  GET_USER_PASSPORT
} from '../../graphql/server/query';

export default function MyCommunity(props: CommunityInterface) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, id } = props;

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  useQuery(GET_COMMUNITY_MEMBERS, { variables: { id } });
  useQuery(GET_COMMUNITY_CHANNELS, {
    variables: { communityId: id, userId: userData?.myPassport.id }
  });

  const handleNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        height: RFValue(80),
        width: RFValue(80),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderWidth: RFValue(1.2),
        borderRadius: RFValue(4),
        borderColor: colors.PRIMARY,
        marginRight: RFValue(10)
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '100%', height: '100%', borderRadius: RFValue(4) }}
      />
    </TouchableRipple>
  );
}
