import React, { Fragment } from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, TouchableRipple } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { NavigationInterface } from '../../../../../types';
import { useThemeContext } from '../../../../../../theme';
import {
  ChannelInterface,
  CommunityInterface
} from '../../../../../../graphql/types';
import { GET_CHANNEL_MEMBERS } from '../../../../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ChannelCardProp extends NavigationInterface {
  communityDetails: CommunityInterface;
  item: ChannelInterface;
}

export default function ChannelCard(props: ChannelCardProp) {
  const { item } = props;
  const { id, name } = item;

  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  useQuery(GET_CHANNEL_MEMBERS, { variables: { input: { channelId: id } } });

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: { title: `#${name}`, channelId: id }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: RFValue(20),
        paddingTop: RFValue(25),
        paddingBottom: RFValue(25),
        backgroundColor: colors.WHITE
      }}
    >
      <Fragment>
        <View>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT
            }}
          >
            #{name}
          </Paragraph>
          {/* <Text numberOfLines={1}>
            <Text style={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}>
              3 connections
            </Text>{' '}
            and{' '}
            <Text style={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}>
              70 other members
            </Text>{' '}
            chatting live
          </Text> */}
        </View>
        <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
      </Fragment>
    </TouchableRipple>
  );
}
