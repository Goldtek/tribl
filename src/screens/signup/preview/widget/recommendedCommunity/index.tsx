import React, { useState, useEffect } from 'react';
import { Card, Text, Title } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../../theme';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import {
  GET_NOAUTH_SINGLE_COMMUNITY,
  GET_COMMUNITY_MEMBERS,
  GET_NOAUTH_NEARYBY_MEMBERS
} from '../../../../../graphql/server/query';
import {
  CommunityInterface,
  SingleCommunityRequestInterface
} from '../../../../../graphql/types';
import hexToRGB from '../../../../../utils/hexToRGB';

import { LeftCover, TitleCover } from './styles';

interface ScreenProp extends CommunityInterface {
  location: {
    lat: number;
    long: number;
    city: string;
    state: string;
    country: string;
  };
}

function RecommendedCommunity(props: ScreenProp) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState({ ...props });

  const { id, name, avatar, isPrivate, membersCount } = community;

  const { data } = useQuery<SingleCommunityRequestInterface>(
    GET_NOAUTH_SINGLE_COMMUNITY,
    { variables: { input: { filter: { id } } } }
  );

  useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { input: { filter: { communityId: id } } }
  });

  useQuery(GET_NOAUTH_NEARYBY_MEMBERS, {
    variables: { input: { communityId: id } }
  });

  const handleNavigation = () => {
    navigation.navigate('TribeDetailScreen', {
      title: name,
      details: props
    });
  };

  useEffect(() => {
    if (data?.Community.data || props) {
      setCommunity({ ...community, ...props, ...data?.Community.data });
    }
  }, [props.isMember, data?.Community.data]);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: '100%',
        height: RFValue(300),
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        marginTop: 3,
        elevation: 0
      }}
    >
      <Card.Content
        style={{
          width: DEVICE_FULL_WIDTH - 30,
          height: RFValue(230),
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
        <Text
          style={{
            fontSize: fonts.LARGE_SIZE - 1,
            fontFamily: fonts.WORK_SANS_BOLD,
            color: colors.WHITE,
            backgroundColor: hexToRGB(colors.WHITE, 0.3),
            position: 'absolute',
            left: 15,
            top: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 10,
            textTransform: 'capitalize'
          }}
        >
          {isPrivate ? 'Private' : 'Public'}
        </Text>
      </Card.Content>
      <Card.Content
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 0,
          marginTop: RFValue(10)
        }}
      >
        <LeftCover>
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{ uri: avatar, priority: FastImage.priority.high }}
            style={{
              width: RFValue(45),
              height: RFValue(45),
              borderRadius: 5
            }}
          />
          <TitleCover>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                lineHeight: RFValue(15)
              }}
            >
              {name}
            </Title>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.SECONDARY_TEXT,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                lineHeight: RFValue(13)
              }}
            >
              {membersCount <= 1
                ? `${membersCount} ${t(`community.tabPanel.member`)}`
                : `${membersCount} ${t(`community.tabPanel.member`)}s`}
            </Text>
            {/* <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.ONLINE
              }}
            >
              <Feather name="star" size={13} color={colors.ONLINE} /> Popular
            </Text> */}
          </TitleCover>
        </LeftCover>
      </Card.Content>
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
