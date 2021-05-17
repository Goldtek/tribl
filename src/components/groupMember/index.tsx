import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { connectHighlight } from 'react-instantsearch-native';
import CheckBox from '@react-native-community/checkbox';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { PassportInterface } from '../../graphql/types';
import { hideSensitiveView } from '../../utils/uxcamHelper';
import { USER_DEFAULT_AVATAR } from '../../constants';
import { chatClient } from '../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, ActionContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionCardProp extends PassportInterface {
  handleSelect(user: PassportInterface): void;
  selected: boolean;
  attribute: string;
}

function GroupMemberCard(props: ConnectionCardProp) {
  const { colors, fonts } = useThemeContext();

  const { selected, handleSelect, ...user } = props;
  const {
    id,
    avatar,
    lastName,
    firstName,
    currentLocation,
    citizenship
  } = user;

  if (
    (id === chatClient.user?.id ||
      !user.verified ||
      lastName == null ||
      firstName == null ||
      currentLocation?.city == null,
      currentLocation?.state == null)
  ) {
    return null;
  }

  const onPress = () => handleSelect(user);

  if (id) {
    useQuery(GET_SINGLE_PASSPORT, { variables: { id } });
  }



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
      onPress={onPress}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: avatar || USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
        />
        <ActionContainer>
          <NameContainer ref={hideSensitiveView}>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                textTransform: 'capitalize'
              }}
            >
              {`${firstName} ${lastName}`}
            </Title>
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE - 2),
                textTransform: 'capitalize'
              }}
            >
              {currentLocation?.city
                ? `${currentLocation?.city}, ${currentLocation?.state}`
                : currentLocation?.country !== undefined
                  ? `${currentLocation?.state}, ${currentLocation?.country}`
                  : null}
            </Text>
            {citizenship?.length ? (
              <Title
                style={{
                  fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                  lineHeight: RFValue(17)
                }}
              >
                {citizenship?.map((country) => country.flag)}
              </Title>
            ) : null}
          </NameContainer>
          <CheckBox
            disabled={true}
            value={selected}
            tintColors={{
              true: colors.PRIMARY,
              false: colors.INACTIVE
            }}
            animationDuration={0.2}
            tintColor={colors.INACTIVE}
            onCheckColor={colors.WHITE}
            onFillColor={colors.PRIMARY}
            onTintColor={colors.PRIMARY}
            style={{ width: RFValue(20), height: RFValue(20) }}
          />
        </ActionContainer>
      </Fragment>
    </TouchableRipple>
  );
}

//@ts-ignore
export default connectHighlight(GroupMemberCard, () => false);
