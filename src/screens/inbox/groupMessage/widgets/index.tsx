import React, { Fragment, useEffect } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery } from '@apollo/react-hooks';
import CheckBox from '@react-native-community/checkbox';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';

import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { PassportInterface } from '../../../../graphql/types';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, ActionContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionCardProp extends PassportInterface {
  handleSelect(T: string): void;
  selected: boolean;
  member: string;
}

export default function GroupMembersCard(props: ConnectionCardProp) {
  const { colors, fonts } = useThemeContext();

  const {
    id,
    avatar,
    firstName,
    lastName,
    currentLocation,
    selected,
    handleSelect
  } = props;
  const onPress = () => handleSelect(id);

  // useQuery(GET_SINGLE_PASSPORT, { variables: { id } });

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id }
  });

  useEffect(() => {
    getUserPassport();
  }, []);

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
      // onPress={handleMessageNavigation}
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
                : `${currentLocation?.state}, ${currentLocation?.country}`}
            </Text>
          </NameContainer>
          <CheckBox
            // style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            animationDuration={0.2}
            disabled={false}
            value={selected}
            onValueChange={onPress}
            tintColors={{
              true: colors.PRIMARY,
              false: colors.INACTIVE
            }}
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

// export default React.memo(ConnectionCard);
