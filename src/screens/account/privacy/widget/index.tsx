import React, { useEffect, useRef, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { TouchableRipple, Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';
import { UPDATE_PASSPORT } from '../../../../graphql/server/mutations';
import { MyPassportInterface } from '../../../../graphql/types';
import { crashlytics } from '../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function PrivacyModal(props: any) {
  const { isVisible, closePrivacyModal, index } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    value: props.privacyValues[props.inView]
  });

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  const { data: userData } = useQuery(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  useEffect(() => {
    if (isVisible) {
      openModal();
      props.privacyValue(state.value);
      setState({
        ...state,
        value: props.privacyValues[props.inView]
      });
    } else {
      closeModal();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      props.privacyValue(state.value);
    }
  }, [state.value]);

  enum privacyOptions {
    EVERYONE,
    CONNECTIONS,
    ME
  }

  enum privacyItems {
    identity,
    locality,
    interest,
    age
  }
  const params =
    index == 0
      ? privacyItems[0]
      : index == 1
      ? privacyItems[1]
      : index == 2
      ? privacyItems[2]
      : privacyItems[3];

  const [updatePassport] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        privacy: {
          [params]: state.value,
          visibility: privacyOptions[0]
        }
      }
    }
  });

  const handleChange = async (item: any) => {
    setState({
      ...state,
      value: item
    });

    try {
      const { data } = await updatePassport();
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

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
            onPress={() => handleChange(privacyOptions[0])}
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
              {state.value === privacyOptions[0] ? (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              ) : null}
            </Fragment>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => handleChange(privacyOptions[1])}
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
              {state.value === privacyOptions[1] ? (
                <AntDesign name="check" size={25} color={colors.PRIMARY_TEXT} />
              ) : null}
            </Fragment>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => handleChange(privacyOptions[2])}
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
              {state.value === privacyOptions[2] ? (
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
