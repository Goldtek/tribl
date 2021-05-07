import React, { useState, useEffect } from 'react';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useLazyQuery } from '@apollo/react-hooks';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { PassportInterface, UserPassportInterface } from '../../graphql/types';
import {
  GET_NOAUTH_SINGLE_PASSPORT,
  GET_NOAUTH_RECOMMENDED_MEMBERS,
  GET_NOAUTH_NEARYBY_MEMBERS
} from '../../graphql/server/query';
import AdminBadge from '../adminBadge';
import { hideSensitiveView } from '../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, Container, AvatarContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface PreviewRecommendedUserProp extends PassportInterface {}

export default function PreviewRecommendedUser(
  props: PreviewRecommendedUserProp
) {
  const { colors, fonts } = useThemeContext();

  const navigation = useNavigation();
  const [member, setMember] = useState(props);

  const {
    id,
    avatar,
    lastName,
    firstName,
    citizenship,
    moderatorOf,
    currentLocation
  } = member;

  const [getUserPassport] = useLazyQuery<UserPassportInterface>(
    GET_NOAUTH_SINGLE_PASSPORT,
    { variables: { id } }
  );

  const [getRecommendedMembers] = useLazyQuery(GET_NOAUTH_RECOMMENDED_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
  });

  const [getNearbyMembers] = useLazyQuery(GET_NOAUTH_NEARYBY_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
  });

  useEffect(() => {
    getNearbyMembers();
    getRecommendedMembers();
    getUserPassport();
  }, []);

  const handleNavigation = () => {
    navigation.navigate('MemberPassportDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...member }
    });
  };

  return (
    <TouchableOpacity onPress={handleNavigation} activeOpacity={0.5}>
      <Container>
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
          {moderatorOf?.length ? (
            <AdminBadge
              style={{
                position: 'absolute',
                bottom: RFValue(-5),
                right: RFValue(-25)
              }}
            />
          ) : null}
        </AvatarContainer>
        <TextContainer ref={hideSensitiveView}>
          <Title
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              marginTop: 0,
              marginBottom: 0,
              paddingHorizontal: RFValue(10),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {currentLocation?.city ? (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.city}, ${currentLocation?.state}`}
            </Paragraph>
          ) : (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.state}, ${currentLocation?.country}`}
            </Paragraph>
          )}
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                marginTop: RFValue(1)
              }}
            >
              {citizenship?.map((country) => country.flag)}
            </Title>
          ) : null}
        </TextContainer>
      </Container>
    </TouchableOpacity>
  );
}
