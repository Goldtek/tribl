import React, { useState, Fragment } from 'react';
import { TouchableHighlight } from 'react-native';
import { Container } from './styles';
import { Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';

interface RadioButtonProp {
  Data: object[];
}

export default function RadioButton(props: any) {
  const { colors, fonts } = useThemeContext();

  const [state, setState] = useState({
    value: ''
  });

  const { Data } = props;
  const value = state.value;

  const handleChange = (item: any) => {
    setState({
      ...state,
      value: item
    });
    props.parentCallBack(value);
  };

  return (
    <Container>
      {Data.map((item: any) => {
        return (
          <TouchableHighlight
            onPress={() => handleChange(item.key)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: RFValue(25)
            }}
          >
            <Fragment>
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.LARGE_SIZE + 2,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {item.text}
              </Text>
              {state.value == item.key && (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              )}
            </Fragment>
          </TouchableHighlight>
        );
      })}
    </Container>
  );
}
