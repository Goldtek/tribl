import React, { Fragment } from 'react';
import { connectHighlight } from 'react-instantsearch-native';
import { TouchableHighlight } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';

// DEFINE SCREEN PROP TYPES
interface HighlightProp {
  highlight(T: any): any[];
  attribute: string;
  hit: any;
  handleAddition: any;
}

const Highlight = (props: HighlightProp) => {
  const { hit, handleAddition } = props;
  const { colors, fonts } = useThemeContext();
  return (
    <Fragment>
      <TouchableHighlight
        key={hit.id}
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
        onPress={() => handleAddition(hit)}
      >
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: hit.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(25),
              height: RFValue(25),
              borderRadius: RFValue(50),
              marginRight: RFValue(7)
            }}
          />
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_MEDIUM,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {`${hit.firstName} ${hit.lastName}`}
          </Text>
        </Fragment>
      </TouchableHighlight>
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
export default connectHighlight(Highlight);
