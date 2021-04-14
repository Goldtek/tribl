import React, { Fragment, useState, useEffect } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Entypo, Feather } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { REQUEST_CONNECTION } from '../../../../graphql/server/mutations';
import {
  PassportInterface,
  SinglePassportRequestInterface
} from '../../../../graphql/types';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, CheckboxCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends PassportInterface {
  handleSelect(T: {}): void;
  selected: {};
  member: string;
}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();

  const {
    avatar,
    firstName,
    lastName,
    id,
    handleSelect,
    selected,
    member
  } = props;

  const onPress = () => handleSelect({ id, avatar, firstName });

  const [toggle, setToggle] = useState(false);

  //   console.tron('selected', selected?.id == id);

  useEffect(() => {
    if (selected?.id !== id) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }, [selected]);

  const { data: singlePassportData } = useQuery<SinglePassportRequestInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id } }
  );

  const singlePassport = singlePassportData?.singlePassport;
  const location = singlePassport?.currentLocation;
  const citizenship = singlePassport?.citizenship;

  return (
    <TouchableRipple
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
      }}
      onPress={() => {}}
    >
      <Fragment>
        <FastImage
          source={{ uri: avatar, priority: FastImage.priority.high }}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: RFValue(4)
          }}
        />
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize',
              lineHeight: RFValue(15)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>

          {location && (
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {location?.city
                ? `${location?.city}, ${location?.state}`
                : `${location?.state}, ${location?.country}`}
            </Text>
          )}
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
        <CheckboxCover>
          <CheckBox
            disabled={false}
            value={toggle}
            onValueChange={onPress}
            boxType="circle"
            tintColors={{
              true: colors.PRIMARY,
              false: colors.INACTIVE
            }}
            tintColor={colors.INACTIVE}
            onCheckColor={colors.WHITE}
            onFillColor={colors.PRIMARY}
            onTintColor={colors.PRIMARY}
            animationDuration={0.3}
            style={{ width: RFValue(20), height: RFValue(20) }}
          />
        </CheckboxCover>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member, () => false);
