import React, { Fragment } from 'react';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, TouchableRipple } from 'react-native-paper';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../theme';

// DEFINE SCREEN PROP TYPES
interface WalletCardProp {
  name: string;
  route: string;
}

export default function WalletCard(props: WalletCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {
    navigation.navigate(props.route);
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: RFValue(20),
        // paddingTop: RFValue(20),
        // paddingBottom: RFValue(20),
        backgroundColor: colors.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: colors.INACTIVE
      }}
    >
      <Fragment>
        <View>
          <Paragraph
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.BLACK
            }}
          >
            {props.name}
          </Paragraph>
        </View>
        <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
      </Fragment>
    </TouchableRipple>
  );
}
