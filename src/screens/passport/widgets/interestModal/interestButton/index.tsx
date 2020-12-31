import React from 'react';
import { TouchableHighlight } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Interest } from './styles';

// DEFINE SCREEN PROP TYPES
interface InterestButtonProp {
  interest: string;
  selected: boolean;
  id: string;
  handleSelect(T: string, K: string): void;
}

function InterestButton(props: InterestButtonProp) {
  const { interest, handleSelect, selected, id } = props;
  const { colors } = useThemeContext();

  const onPress = () => handleSelect(interest, id);

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
        <Interest>{interest}</Interest>
      ) : (
        <GradientContainer
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[colors.PRIMARY, colors.SECONDARY]}
          style={{ borderRadius: 4 }}
        >
          <Interest style={{ color: colors.WHITE }}>{interest}</Interest>
        </GradientContainer>
      )}
    </TouchableHighlight>
  );
}

export default React.memo(InterestButton);
