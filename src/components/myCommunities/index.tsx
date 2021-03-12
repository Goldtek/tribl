import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { CommunityInterface } from '../../graphql/types';
import {
  GET_COMMUNITY_MEMBERS,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY
} from '../../graphql/server/query';

export default function MyCommunity(props: CommunityInterface) {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, name, id } = props;

  useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { input: { filter: { communityId: id } } }
  });

  useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY, {
    variables: { input: { communityId: id } }
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
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1.2,
        borderRadius: 4,
        borderColor: colors.PRIMARY,
        marginRight: 10
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.stretch}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{ width: '100%', height: '100%', borderRadius: 4 }}
      />
    </TouchableRipple>
  );
}
