import React, { Fragment } from 'react';
import { TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import {
  GET_COMMUNITY_MEMBERS,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY
} from '../../../../graphql/server/query';
import { useQuery } from '@apollo/react-hooks';
import { CommunityInterface } from '../../../../graphql/types';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

import { NameContainer } from './styles';

interface CommunityProp extends CommunityInterface {}

export default function Community(props: CommunityProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { id, avatar, name } = props;

  useQuery(GET_COMMUNITY_MEMBERS, { variables: { id } });
  useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY, {
    variables: { filter: { participantOf: { id } } }
  });

  return (
    <TouchableRipple
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
      }}
      onPress={() => {
        return navigation.navigate('CommunityDetailScreen', {
          title: name,
          details: { ...props }
        });
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderRadius: RFValue(4)
          }}
        />
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE)
            }}
          >
            {name}
          </Title>
        </NameContainer>
      </Fragment>
    </TouchableRipple>
  );
}
