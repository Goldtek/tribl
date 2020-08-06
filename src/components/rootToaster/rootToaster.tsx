import React, { FunctionComponent, useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Title } from 'react-native-paper';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';
import {
  DeviceEventEmitter,
  EmitterSubscription,
  TextStyle,
  ViewStyle,
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { Container } from './styles';

const DEFAULT_DURATION = 3000;
const ANIMATION_DELAY = 500;

interface RootToasterProps {
  visible?: boolean;
  defaultDuration?: number;
  defaultMessage?: string;
  defaultColor?: string;
  CloseComponent?: FunctionComponent;
  container?: ViewStyle;
  safeContainer?: ViewStyle;
  modal?: ViewStyle;
  textStyle?: TextStyle;
}

export function RootToaster(props: RootToasterProps) {
  const { colors, fonts } = useThemeContext();
  const { top: paddingTop } = useSafeAreaInsets();

  const {
    visible = false,
    defaultDuration = DEFAULT_DURATION,
    defaultMessage = '',
    defaultColor,
    CloseComponent
  } = props;

  const [state, setState] = useState({
    isVisible: visible,
    duration: defaultDuration,
    text: defaultMessage
  });

  let _hideTimeout = 0;
  let _showTimeout = {} as NodeJS.Timeout;
  let eventListener: EmitterSubscription | null = null;

  const _show = (text: string = state.text, duration?: number) => {
    setTimeout(() => {
      StatusBar.setBarStyle('light-content');
    }, ANIMATION_DELAY / 2);
    clearTimeout(_showTimeout);
    clearTimeout(_hideTimeout);

    setState({
      ...state,
      text,
      duration: duration || DEFAULT_DURATION,
      isVisible: true
    });

    if (state.duration > 0) {
      _showTimeout = setTimeout(() => _hide(), state.duration);
    }
  };

  const _hide = () => {
    StatusBar.setBarStyle('dark-content');
    clearTimeout(_showTimeout);
    clearTimeout(_hideTimeout);

    setState({ ...state, isVisible: false });
  };

  const listener = (data: { message: string; duration?: number }): void => {
    _show(data.message || '', data.duration);
  };

  useEffect(() => {
    eventListener = DeviceEventEmitter.addListener('showToaster', listener);

    if (state.isVisible) _show();

    return () => {
      if (eventListener) {
        DeviceEventEmitter.removeListener('showToaster', listener);
      }
    };
  }, []);

  return (
    <Modal
      isVisible={state.isVisible}
      animationIn="slideInDown"
      animationInTiming={ANIMATION_DELAY}
      animationOut="slideOutUp"
      animationOutTiming={ANIMATION_DELAY}
      hasBackdrop={false}
      coverScreen={false}
      style={{ flex: 1, margin: 0, justifyContent: 'flex-start' }}
    >
      <SafeAreaView
        style={{
          backgroundColor: defaultColor
            ? defaultColor
            : hexToRGB(colors.BLACK, 0.9),
          paddingTop: paddingTop
        }}
      >
        <Container>
          <Title
            style={{
              flex: 1,
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.WHITE,
              lineHeight: RFValue(30)
            }}
          >
            {state.text}
          </Title>

          {CloseComponent && (
            <TouchableOpacity onPress={_hide}>
              {CloseComponent({})}
            </TouchableOpacity>
          )}
        </Container>
      </SafeAreaView>
    </Modal>
  );
}
