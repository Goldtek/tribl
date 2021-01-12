import React from 'react';
import { TouchableHighlight } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Interest } from './styles';

export interface InterestsInterface {
  name: string;
  id: string;
}

// DEFINE SCREEN PROP TYPES
interface InterestButtonProp {
  selected: boolean;
  handleSelect(): void;
  interest: InterestsInterface;
}

function InterestButton(props: InterestButtonProp) {
  const { interest, handleSelect, selected } = props;
  const { colors } = useThemeContext();

  return (
    <TouchableHighlight
      onPress={handleSelect}
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
        <Interest>{interest.name}</Interest>
      ) : (
        <GradientContainer
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[colors.PRIMARY, colors.SECONDARY]}
          style={{ borderRadius: 4 }}
        >
          <Interest style={{ color: colors.WHITE }}>{interest.name}</Interest>
        </GradientContainer>
      )}
    </TouchableHighlight>
  );
}

export default React.memo(InterestButton);
