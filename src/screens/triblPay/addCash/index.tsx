import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Text, Button } from 'react-native-paper';
import { Image, TextInput, Keyboard, Modal } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import GradientButton from '../../../components/gradientButton';

import { Container, Cover, LogoCover, CashCover, Overlay } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useQuery } from '@apollo/react-hooks';
import { GET_FUNDING_SOURCES } from '../../../graphql/server/query';
import { FontAwesome } from '@expo/vector-icons';
import View from 'react-native-simple-shadow-view';
import { DEVICE_FULL_HEIGHT, DEVICE_FULL_WIDTH } from '../../../utils/device';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AddCashScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const { data: userFundingSources } = useQuery(GET_FUNDING_SOURCES, {
    variables: { input: {} }
  });

  const { myFundingSources } = userFundingSources;

  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [cardCvc, setCardCvc] = useState<any>(null);

  const inputRef = useRef<TextInput>(null);
  const modalInputRef = useRef<TextInput>(null);

  const [value, setValue] = useState<any>();
  const [items, setItems] = useState<any>();

  useEffect(() => {
    if (myFundingSources.data) {
      setItems(
        myFundingSources.data.map((x: any) => {
          return {
            label: `xxxx xxxx xxx ${x.card.last4}`,
            value: x.card.last4,
            icon: () => (
              <FontAwesome
                name="credit-card"
                size={22}
                color={colors.PRIMARY_TEXT}
              />
            )
          };
        })
      );
      setValue(myFundingSources.data[0]?.card?.last4);
    }

    inputRef.current?.focus();
  }, []);

  const openModal = (item: any) => {
    setModalState(!modalState);
    setModalData(item);
  };

  return (
    <Container onPress={() => Keyboard.dismiss()}>
      <Cover>
        <LogoCover>
          <Image
            source={require('../../../../assets/images/logo.png')}
            style={{
              resizeMode: 'contain',
              width: RFValue(40),
              height: RFValue(40)
            }}
          />
          <Text
            style={{
              color: colors.PRIMARY,
              fontSize: RFValue(fonts.LARGE_SIZE + 7),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.pay`)}
          </Text>
        </LogoCover>
        <CashCover>
          <Title
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(50)
            }}
          >
            {'\u0024'}
          </Title>
          <TextInput
            ref={inputRef}
            onChangeText={(number) => setNumber(number)}
            value={number}
            placeholder="0.00"
            keyboardType="numeric"
            returnKeyType="done"
            placeholderTextColor={colors.BLACK}
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(55)
            }}
          />
        </CashCover>

        <DropDownPicker
          containerStyle={{ marginTop: 50 }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </Cover>

      <GradientButton
        onPress={
          cardCvc
            ? () => navigation.navigate('WalletScreen')
            : () => openModal('item')
        }
        // onPress={() => navigation.navigate('WalletScreen')}

        style={{
          height: 50
        }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30)
        }}
        contentStyle={{
          height: 50
        }}
      >
        {/* {t(`community.passport.addAmount`)} */}
        {cardCvc ? 'Add' : 'Next'}
      </GradientButton>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState}
        onRequestClose={() => setModalState(!modalState)}
      >
        {/* <Overlay activeOpacity={1} onPress={() => setModalState(!modalState)}> */}
        <Overlay activeOpacity={1}>
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps={'always'}
            enableOnAndroid={true}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: DEVICE_FULL_HEIGHT / 2.5,
                marginBottom: 100
              }}
            >
              <View
                style={{
                  // margin: 20,
                  backgroundColor: colors.WHITE,
                  borderRadius: 10,
                  padding: 20,
                  width: DEVICE_FULL_WIDTH * 0.9,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
              >
                <FontAwesome
                  name="credit-card"
                  size={60}
                  color={colors.PRIMARY}
                />
                <Title>Please Confirm CVV/CVC</Title>
                <Text>{`xxxx xxxx xxxx ${value}`}</Text>
                <View>
                  <TextInput
                    ref={modalInputRef}
                    autoFocus={true}
                    onChangeText={(number) => setCardCvc(number)}
                    value={cardCvc}
                    placeholder="xxx"
                    keyboardType="numeric"
                    placeholderTextColor={colors.INACTIVE}
                    style={{
                      color: colors.BLACK,
                      fontSize: RFValue(fonts.LARGE_SIZE + 10),
                      fontFamily: fonts.WORK_SANS_BOLD,
                      marginTop: 10,
                      lineHeight: RFValue(30)
                    }}
                  />
                </View>
                <Button
                  onPress={() => setModalState(!modalState)}
                  style={{ marginTop: 20 }}
                  labelStyle={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                    color: colors.PRIMARY,
                    textTransform: 'uppercase'
                  }}
                  contentStyle={{ justifyContent: 'flex-start' }}
                >
                  Done
                </Button>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Overlay>
      </Modal>
    </Container>
  );
}
