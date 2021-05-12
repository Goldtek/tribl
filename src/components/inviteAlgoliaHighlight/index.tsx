import React, { Fragment } from 'react';
import { connectHighlight } from 'react-instantsearch-native';
import { TouchableOpacity } from 'react-native';
import { Divider, Text, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { PassportInterface } from '../../graphql/types';
import hexToRGB from '../../utils/hexToRGB';

import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface HighlightProp extends PassportInterface {
  handleSelect: () => void;
}

const InviteAlgoliaHighlight = (props: HighlightProp) => {
  const { firstName, lastName, id, avatar, handleSelect, citizenship } = props;
  const { colors, fonts } = useThemeContext();

  if (
    (!props.verified ||
      props.lastName == null ||
      props.firstName == null ||
      props.currentLocation?.city == null,
    props.currentLocation?.state == null)
  ) {
    return null;
  }

  return (
    <Fragment>
      <TouchableOpacity
        key={id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: colors.TRANSPARENT,
          paddingVertical: RFValue(4),
          paddingHorizontal: RFValue(10),
          borderRadius: 4
        }}
        onPress={handleSelect}
      >
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(25),
              height: RFValue(25),
              borderRadius: RFValue(50),
              marginRight: RFValue(7)
            }}
          />
          <NameContainer>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_MEDIUM,
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${firstName} ${lastName}`}
            </Text>

            {citizenship?.length ? (
              <Title
                style={{
                  fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                  lineHeight: RFValue(16)
                }}
              >
                {citizenship?.map((country) => country.flag)}
              </Title>
            ) : null}
          </NameContainer>
        </Fragment>
      </TouchableOpacity>
      <Divider
        style={{
          height: 1.5,
          backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
        }}
      />
    </Fragment>
  );
};

//@ts-ignore
export default connectHighlight(InviteAlgoliaHighlight);
