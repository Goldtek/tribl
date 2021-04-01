import React, { Fragment, useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { GET_MY_COMMUNITIES } from '../../../../graphql/server/query';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';
import { useLazyQuery } from '@apollo/react-hooks';
import { CommunityInterface } from '../../../../graphql/types';

import { NameContainer, CheckboxCover } from './styles';
import { PAGINATION_DEFAULT } from '../../../../constants';

interface InviteToTribeProp extends CommunityInterface {
  handleSelect(T: string): void;
  selected: string;
  tribe: string;
}

export default function InviteToTribe(props: InviteToTribeProp) {
  const { colors, fonts } = useThemeContext();
  const { id, avatar, name, handleSelect, selected } = props;
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (selected !== id) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }, [selected]);

  const onPress = () => handleSelect(id);

  const [getUserCommunities] = useLazyQuery(GET_MY_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT * 2, skip: 0 } }
  });

  useEffect(() => {
    getUserCommunities();
  }, []);

  return (
    <TouchableRipple
      style={{
        height: RFValue(45),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(10)
      }}
      onPress={() => {}}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(40),
            borderRadius: RFValue(5)
          }}
        />
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            {name}
          </Title>
        </NameContainer>
        <CheckboxCover>
          <CheckBox
            disabled={false}
            value={toggle}
            onValueChange={onPress}
            boxType="square"
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
