import React from 'react';
import { TouchableHighlight } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Identity } from '../styles';

// DEFINE SCREEN PROP TYPES
interface IdentityButtonProp {
  identity: string;
  selected: boolean;
  handleSelect(T: string): void;
}

function IdentityButton(props: IdentityButtonProp) {
  const { identity, handleSelect, selected } = props;

  const { colors } = useThemeContext();

  const onPress = () => handleSelect(identity);

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.DISABLED}
      style={{
        flex: 1,
        flexBasis: '40%',
        height: RFValue(50),
        justifyContent: 'center',
        margin: 5,
        borderRadius: 4,
        borderWidth: 1.2,
        borderColor: colors.DISABLED
      }}
    >
      {!selected ? (
        <Identity>{identity}</Identity>
      ) : (
        <GradientContainer
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[colors.PRIMARY, colors.SECONDARY]}
          style={{ borderRadius: 4 }}
        >
          <Identity style={{ color: colors.WHITE }}>{identity}</Identity>
        </GradientContainer>
      )}
    </TouchableHighlight>
  );
}

export default React.memo(IdentityButton);
