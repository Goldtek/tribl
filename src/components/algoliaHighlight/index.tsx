import React, { Fragment } from 'react';
import { connectHighlight } from 'react-instantsearch-native';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { GET_USER_PASSPORT } from '../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, Container } from './style';

// DEFINE SCREEN PROP TYPES
interface HighlightProp {
  highlight(T: any): any[];
  attribute: string;
  hit: any;
}

const Highlight = (props: HighlightProp) => {
  const { hit } = props;
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;

  const handleNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: `${hit.name}`,
      avatar: `${hit.avatar}`,
      communityHit: hit
    });
  };

  const handlePassportNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      title: `${hit.firstName} ${hit.lastName}`,
      avatar: `${hit.avatar}`,
      details: hit
    });
  };

  const filteredList = hit.id !== fireAuth.currentUser?.uid ? hit : null;
  const state = hit?.currentLocation?.state;
  const city = hit?.currentLocation?.city;
  const country = hit?.currentLocation?.country;

  return (
    <Container>
      {hit.name ? (
        <TouchableRipple
          key={hit.id}
          style={{
            flex: 1,
            width: '100%',
            height: RFValue(80),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
          rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
          onPress={handleNavigation}
        >
          <Fragment>
            <FastImage
              resizeMode={FastImage.resizeMode.stretch}
              source={{
                uri: hit.avatar,
                priority: FastImage.priority.high
              }}
              style={{
                width: RFValue(60),
                height: RFValue(60),
                borderRadius: RFValue(4)
              }}
            />
            <NameContainer>
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
              >
                {hit.name}
              </Title>
              <Text
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE)
                }}
              >
                {hit.membersCount}
              </Text>
            </NameContainer>
          </Fragment>
        </TouchableRipple>
      ) : (
        <TouchableRipple
          key={hit.id}
          style={{
            flex: 1,
            width: '100%',
            height: RFValue(80),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
          rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
          onPress={handlePassportNavigation}
        >
          <Fragment>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: filteredList?.avatar,
                priority: FastImage.priority.high
              }}
              style={{
                width: RFValue(60),
                height: RFValue(60),
                borderRadius: RFValue(4)
              }}
            />
            <NameContainer>
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
              >
                {`${hit?.firstName} ${hit?.lastName}`}
              </Title>
              <Text
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE)
                }}
              >
                {city ? `${city} ${state}` : `${state} ${country}`}
              </Text>
            </NameContainer>
          </Fragment>
        </TouchableRipple>
      )}
    </Container>
  );
};

//@ts-ignore
export default connectHighlight(Highlight);
