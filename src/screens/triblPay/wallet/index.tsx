import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Text, Button, Divider } from 'react-native-paper';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import { ScrollView, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import {
  GET_PORTFOLIO,
  GET_MARKET,
  GET_FUNDING_SOURCES
} from '../../../graphql/server/query';
import Portfolio from './widgets/portfolio';

import {
  Container,
  BalanceCover,
  ButtonCover,
  Cover,
  LeftCover,
  RightCover,
  Overlay,
  ListCover
} from './styles';
import { Modal, TouchableOpacity, View } from 'react-native';
import { DEVICE_FULL_HEIGHT, DEVICE_FULL_WIDTH } from '../../../utils/device';
import truncate from 'lodash/truncate';

interface charPortfolio {
  availabble: number;
}

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function WalletScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState<any>();
  const filtered_data = [];
  //TODO, define a type for these
  const filtered_markets: any = [];
  const charPortfolio: any = {};

  const { data: requestData, refetch, error } = useQuery(GET_PORTFOLIO);

  const { data: fetched_markets } = useQuery(GET_MARKET);

  const { data: userFundingSources } = useQuery(GET_FUNDING_SOURCES, {
    variables: { input: {} }
  });

  const { myFundingSources } = userFundingSources;
  const portfolio = requestData?.fetchPortfolio;

  const fetchMarket = fetched_markets?.fetchMarket;
  const markets = fetchMarket?.markets;

  if (markets) {
    for (let item of markets) {
      if (
        item.market === 'BTCUSD' ||
        item.market === 'ETHUSD' ||
        item.market === 'PAXGUSD'
      ) {
        filtered_markets.push(item);
      }
    }
  }

  if (portfolio) {
    for (let item of portfolio.items) {
      if (
        item.asset === 'BTC' ||
        item.asset === 'ETH' ||
        item.asset === 'USD'
      ) {
        filtered_data.push(item);
        charPortfolio[item.asset] = {
          available: item.available
        };
      }
    }
  }

  const openModal = (item: any) => {
    setModalState(!modalState);
    setModalData(item);
  };

  return (
    <Container>
      <Title
        style={{
          color: colors.BLACK,
          fontSize: RFValue(fonts.LARGE_SIZE * 2),
          fontFamily: fonts.WORK_SANS_BOLD,
          lineHeight: RFValue(40),
          textAlign: 'center',
          marginTop: -10,
          paddingTop: 0
        }}
      >
        {'\u0024'}
        {charPortfolio['USD'] !== undefined
          ? Math.ceil(charPortfolio['USD'].available)
          : 0.0}
      </Title>
      <BalanceCover>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.cashBalance`)}
        </Text>
      </BalanceCover>
      <ButtonCover>
        {charPortfolio['USD'] !== undefined &&
        charPortfolio['USD'].available > 0 ? (
          <GradientButton
            onPress={() => navigation.navigate('CryptoFaqScreen', { refetch })}
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
            {t(`community.passport.crypto`)}
          </GradientButton>
        ) : (
          <GradientButton
            onPress={() => navigation.navigate('AddCashScreen')}
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
            {t(`community.passport.addCash`)}
          </GradientButton>
        )}

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
          {t(`community.passport.cashOut`)}
        </GradientButton>
      </ButtonCover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.BLACK,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.linkedAccounts`)}
      </Title>
      <Divider />

      {myFundingSources &&
        myFundingSources?.data
          .filter((item: any) => item.card)
          .map((item: any) => (
            <TouchableOpacity key={item.id} onPress={() => openModal(item)}>
              <Cover>
                <LeftCover>
                  <FontAwesome
                    name="credit-card"
                    size={22}
                    color={colors.PRIMARY_TEXT}
                  />
                  <Text
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontSize: RFValue(fonts.LARGE_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(17),
                      textTransform: 'uppercase',
                      marginLeft: RFValue(10)
                    }}
                  >
                    {`**** **** **** ${item.card.last4}`}
                  </Text>
                </LeftCover>
              </Cover>
            </TouchableOpacity>
          ))}

      {myFundingSources &&
        myFundingSources?.data
          .filter((item: any) => item.bank)
          .map((item: any) => (
            <TouchableOpacity key={item.id} onPress={() => openModal(item)}>
              <Cover>
                <LeftCover>
                  <FontAwesome
                    name="bank"
                    size={22}
                    color={colors.PRIMARY_TEXT}
                  />

                  <Text
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontSize: RFValue(fonts.LARGE_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(17),
                      textTransform: 'capitalize',
                      marginLeft: RFValue(10)
                    }}
                  >
                    {`${item.bank.paymentInstruction.beneficiaryBankName}`}
                  </Text>
                </LeftCover>
                <RightCover>
                  <Text
                    style={{
                      color: colors.SECONDARY_TEXT,
                      fontSize: RFValue(fonts.LARGE_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(17),
                      textTransform: 'capitalize'
                    }}
                  >
                    {truncate(
                      item.bank.paymentInstruction.beneficiaryBankAccountNumber,
                      {
                        length: 7,
                        omission: '***'
                      }
                    )}
                  </Text>
                </RightCover>
              </Cover>
            </TouchableOpacity>
          ))}

      <Divider />

      <TouchableOpacity
        onPress={() => navigation.navigate('LinkAccountScreen')}
      >
        <Cover>
          <LeftCover>
            <AntDesign name="plus" size={22} color={colors.PRIMARY_TEXT} />
            <Text
              style={{
                color: colors.PRIMARY_TEXT,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(17),
                textTransform: 'capitalize',
                marginLeft: RFValue(10)
              }}
            >
              Add a payment method
            </Text>
          </LeftCover>
          <RightCover>
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(17),
                textTransform: 'capitalize'
              }}
            >
              <Button
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.WHITE,
                  textTransform: 'uppercase'
                }}
                contentStyle={{ justifyContent: 'flex-start' }}
                style={{
                  width: '40%',
                  backgroundColor: colors.ONLINE
                }}
              >
                Add
              </Button>
            </Text>
          </RightCover>
        </Cover>
      </TouchableOpacity>

      <Divider />
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.BLACK,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.cashAccount`)}
      </Title>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.nativeCurrency`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'uppercase',
              marginRight: RFValue(5)
            }}
          >
            USD
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.country`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize',
              marginRight: RFValue(5)
            }}
          >
            United States
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <ListCover>
        <Cover>
          <LeftCover>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 2),
                color: colors.BLACK,
                lineHeight: RFValue(30),
                marginTop: RFValue(5),
                textTransform: 'capitalize'
              }}
            >
              {t(`community.passport.cryptocurrency`)}
            </Title>
          </LeftCover>
          <RightCover>
            <Feather name="more-vertical" size={22} color={colors.BLACK} />
          </RightCover>
        </Cover>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <FlatList
            data={filtered_data}
            renderItem={({ item }) => (
              <Portfolio item={item} markets={filtered_markets} />
            )}
            ItemSeparatorComponent={() => <Divider style={{ height: 1 }} />}
            keyExtractor={(item, index) => String(index)}
          />
        </ScrollView>
      </ListCover>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState}
        onRequestClose={() => setModalState(!modalState)}
      >
        <Overlay activeOpacity={1} onPress={() => setModalState(!modalState)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: DEVICE_FULL_HEIGHT / 2.5
            }}
          >
            <View
              style={{
                margin: 20,
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
              {modalData && modalData.type === 'BANK' && (
                <Title style={{ textTransform: 'capitalize' }}>
                  {modalData.bank.paymentInstruction.beneficiaryBankName}
                </Title>
              )}
              <Text>
                {modalData && modalData.type === 'BANK'
                  ? modalData.bank.paymentInstruction
                      .beneficiaryBankAccountNumber
                  : `xxxx xxxx xxxx ${modalData?.card?.last4}`}
              </Text>
              <Button
                style={{ marginTop: 50 }}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.RED,
                  textTransform: 'uppercase'
                }}
                contentStyle={{ justifyContent: 'flex-start' }}
              >
                {modalData && modalData.type === 'BANK'
                  ? 'Remove Bank'
                  : 'Remove Card'}
              </Button>
            </View>
          </View>
        </Overlay>
      </Modal>
    </Container>
  );
}
