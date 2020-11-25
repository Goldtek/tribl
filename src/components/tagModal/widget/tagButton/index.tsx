import React from 'react';
import { TouchableHighlight } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { GradientContainer, Tag } from './styles';

// DEFINE SCREEN PROP TYPES
interface TagButtonProp {
  tag: string;
  selected: boolean;
  id: string;
  handleSelect(T: string, K: string): void;
}

function TagButton(props: TagButtonProp) {
  const { tag, handleSelect, selected, id } = props;

  const { colors } = useThemeContext();

  const onPress = () => handleSelect(tag, id);

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
        <Tag>{tag}</Tag>
      ) : (
        <GradientContainer
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[colors.PRIMARY, colors.SECONDARY]}
          style={{ borderRadius: 4 }}
        >
          <Tag style={{ color: colors.WHITE }}>{tag}</Tag>
        </GradientContainer>
      )}
    </TouchableHighlight>
  );
}

export default React.memo(TagButton);
