import React, { useEffect, useRef, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { TouchableRipple, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import RadioButton from './radioButton ';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function PrivacyModal(props: any) {
  const { isVisible, closePrivacyModal, privacyValue, index } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    value: props.selectedData
  });

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  enum privacyOptions {
    EVERYONE,
    CONNECTIONS,
    ME
  }

  const handleChange = async (item: any) => {
    setState({
      ...state,
      value: item
    });
    props.privacyValue(state.value);
  };

  const privacyList = [
    {
      key: privacyOptions.EVERYONE,
      text: privacyOptions.EVERYONE
    },
    {
      key: privacyOptions.CONNECTIONS,
      text: privacyOptions.CONNECTIONS
    },
    {
      key: privacyOptions.ME,
      text: privacyOptions.ME
    }
  ];

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClose={closePrivacyModal}
        modalStyle={{ paddingTop: RFValue(30) }}
        modalHeight={DEVICE_FULL_HEIGHT / 3}
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent'
          }}
        >
          <TouchableRipple
            onPress={() => handleChange(privacyOptions.EVERYONE)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: RFValue(15),
              paddingHorizontal: RFValue(15)
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
                {privacyOptions[0]}
              </Text>
              {state.value === privacyOptions.EVERYONE ? (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              ) : null}
            </Fragment>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => handleChange(privacyOptions.CONNECTIONS)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: RFValue(15),
              paddingHorizontal: RFValue(15)
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
                {privacyOptions[1]}
              </Text>
              {state.value === privacyOptions.CONNECTIONS ? (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              ) : null}
            </Fragment>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => handleChange(privacyOptions.ME)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: RFValue(15),
              paddingHorizontal: RFValue(15)
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
                {privacyOptions[2]}
              </Text>
              {state.value === privacyOptions.ME ? (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              ) : null}
            </Fragment>
          </TouchableRipple>
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(PrivacyModal);
