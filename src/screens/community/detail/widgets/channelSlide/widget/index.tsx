import React, { Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationInterface } from '../../../../../types';
import { Paragraph, Divider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';

interface RenderItemsProp extends NavigationInterface {
  name: string;
}

const RenderItems = (props: RenderItemsProp) => {
  const { colors, fonts } = useThemeContext();

  const { name } = props;
  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: RFValue(25),
          paddingBottom: RFValue(25),
          padding: RFValue(20),
          backgroundColor: colors.WHITE
        }}
      >
        <Paragraph
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(16),
            color: colors.PRIMARY_TEXT
          }}
        >
          {name}
        </Paragraph>
        <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
      </TouchableOpacity>
      <Divider />
    </Fragment>
  );
};

export default React.memo(RenderItems);
