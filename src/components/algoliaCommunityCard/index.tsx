import React, { Fragment } from 'react';
import { connectHighlight } from 'react-instantsearch-native';

import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { NavigationInterface } from '../../screens/types';
import hexToRGB from '../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './style';

// DEFINE SCREEN PROP TYPES
interface HighlightProp extends NavigationInterface {
  attribute: string;
  hit: {
    name: string;
    avatar: string;
  };
  highlight(T: any): any[];
  closeModal(): void;
}

const Highlight = (props: HighlightProp) => {
  const { attribute, hit, highlight, navigation, closeModal } = props;
  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {
    closeModal();
    navigation.navigate('CommunityDetailScreen', {
      title: `${hit.name}`,
      avatar: `${hit.avatar}`,
      members: '25k members'
    });
  };

  return (
    <Text>
      {highlights.map(({ value }: any, index: number) => {
        const {
          avatar = 'https://picsum.photos/700',
          name = 'Afrochella',
          members = '25k members'
        } = value;

        return (
          <TouchableRipple
            key={index}
            style={{
              height: RFValue(80),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%'
            }}
            rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
            onPress={handleNavigation}
          >
            <Fragment>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: avatar,
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
                  {members}
                </Text>
              </NameContainer>
            </Fragment>
          </TouchableRipple>
        );
      })}
    </Text>
  );
};

//@ts-ignore
export default connectHighlight(Highlight);
