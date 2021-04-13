import React, { useEffect, useRef, useState } from 'react';
import { Text, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, TextInput, TouchableHighlight } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import { MyPassportInterface } from '../../graphql/types';
import { GET_USER_PASSPORT } from '../../graphql/server/query';
import { USER_DEFAULT_AVATAR } from '../../constants';

import {
  HeaderContainer,
  LogoCover,
  CashCover,
  Amount,
  ButtonCover
} from './styles';
import GradientButton from '../gradientButton';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeTranferModal(): void;
}

function TransferModal(props: ModalProp) {
  const { isVisible, closeTranferModal } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const [number, setNumber] = useState('');

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  useEffect(() => {
    isVisible ? openModal() : closeModal();
  }, [isVisible]);

  return (
    <Portal>
      <StatusBar translucent animated style="light" />

      <Modalize
        ref={modalizeRef}
        onClose={closeTranferModal}
        modalStyle={{
          height: DEVICE_FULL_HEIGHT / 2,
          paddingTop: RFValue(30),
          paddingBottom: RFValue(20),
          marginTop: RFValue(300)
        }}
        HeaderComponent={
          <HeaderContainer>
            <FastImage
              source={{
                uri: userData?.myPassport.avatar || USER_DEFAULT_AVATAR,
                priority: FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.stretch}
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                marginRight: RFValue(10)
              }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: 20
              }}
            >
              {userData?.myPassport?.firstName} {userData?.myPassport?.lastName}
            </Text>
          </HeaderContainer>
        }
      >
        <Card style={{ marginTop: RFValue(5), paddingBottom: RFValue(40) }}>
          <Card.Content>
            <LogoCover>
              <Image
                source={require('../../../assets/images/triblLogo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(25),
                  height: RFValue(25)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 1),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'uppercase'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </LogoCover>
            <CashCover>
              <TouchableHighlight>
                <Text
                  style={{
                    color: colors.BLACK,
                    fontSize: RFValue(fonts.LARGE_SIZE * 2),
                    fontFamily: fonts.WORK_SANS_BOLD,
                    lineHeight: RFValue(50)
                  }}
                >
                  -
                </Text>
              </TouchableHighlight>
              <Amount>
                <Text
                  style={{
                    color: colors.BLACK,
                    fontSize: RFValue(fonts.LARGE_SIZE + 4),
                    fontFamily: fonts.WORK_SANS_MEDIUM,
                    lineHeight: RFValue(20)
                  }}
                >
                  {'\u0024'}
                </Text>
                <TextInput
                  onChangeText={(number) => setNumber(number)}
                  value={number}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={colors.BLACK}
                  style={{
                    color: colors.BLACK,
                    fontSize: RFValue(fonts.LARGE_SIZE + 4),
                    fontFamily: fonts.WORK_SANS_MEDIUM,
                    lineHeight: RFValue(20)
                  }}
                />
              </Amount>
              <TouchableHighlight>
                <Text
                  style={{
                    color: colors.BLACK,
                    fontSize: RFValue(fonts.LARGE_SIZE * 2),
                    fontFamily: fonts.WORK_SANS_BOLD,
                    lineHeight: RFValue(50)
                  }}
                >
                  +
                </Text>
              </TouchableHighlight>
            </CashCover>
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(20),
                textTransform: 'capitalize',
                textAlign: 'center'
              }}
            >
              {t(`community.passport.account`)} 134567
            </Text>
          </Card.Content>
        </Card>
        <ButtonCover>
          <GradientButton
            onPress={() => {}}
            style={{
              height: 50
            }}
            gradientContainerstyle={{
              height: 50,
              width: '48%'
            }}
            contentStyle={{
              height: 50
            }}
          >
            {t(`community.passport.request`)}
          </GradientButton>
          <GradientButton
            onPress={() => {}}
            style={{
              height: 50
            }}
            gradientContainerstyle={{
              height: 50,
              width: '48%'
            }}
            contentStyle={{
              height: 50
            }}
          >
            {t(`community.passport.pay`)}
          </GradientButton>
        </ButtonCover>
      </Modalize>
    </Portal>
  );
}

export default React.memo(TransferModal);
