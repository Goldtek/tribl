import React, { useState } from 'react';
import { useThemeContext } from '../../../theme';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../types';
import TransactionCard from './widget';
import { ScrollView, FlatList, Modal, View } from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { Title, Text, Button, Divider } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

import {
  Container,
  Overlay,
  Cover,
  LeftCover,
  RightCover,
  BalanceCover
} from './styles';
import { GET_TRANSACTION_HISTORY } from '../../../graphql/server/query';
import { DEVICE_FULL_HEIGHT, DEVICE_FULL_WIDTH } from '../../../utils/device';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import FastImage from 'react-native-fast-image';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function TransactionHistory(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { data: { getTransactionHistory: { data = [] } } = {} } = useQuery(
    GET_TRANSACTION_HISTORY,
    {
      variables: { input: {} }
    }
  );
  const [modalState, setModalState] = useState(false);

  const currentItem = {
    Price: '$42,135 per BTC',
    'Payment Method': 'Bank of America',
    Fee: '$3.05',
    Date: '10:22 PM - May 18',
    Status: 'Complete'
  };

  const renderItem = ({ item }: any) => (
    <TransactionCard {...item} onPress={() => setModalState(true)} />
  );

  return (
    <Container>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

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
              alignItems: 'center'
            }}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: colors.WHITE,
                borderRadius: 10,
                width: DEVICE_FULL_WIDTH * 0.9,
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
              <Title
                style={{
                  color: colors.BLACK,
                  textAlign: 'center',
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 3)
                }}
              >
                Bought Bitcoin
              </Title>
              <Divider />
              <BalanceCover style={{ paddingVertical: RFValue(15) }}>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: USER_DEFAULT_AVATAR,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(50),
                    height: RFValue(50),
                    borderRadius: RFValue(5),
                    marginBottom: 10
                  }}
                />
                <Text
                  style={{
                    color: colors.BLACK,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    marginVertical: 10
                  }}
                >
                  0.00005793 BTC
                </Text>
                <Text
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR
                  }}
                >
                  $100.00
                </Text>
              </BalanceCover>
              <Divider />
              {Object.keys(currentItem).map((key: string, index) => (
                <Cover
                  style={{
                    paddingVertical: RFValue(15),
                    marginHorizontal: RFValue(20),

                    // borderBottomColor: colors.BLACK,
                    borderColor: colors.INACTIVE,
                    borderBottomWidth:
                      index === Object.keys(currentItem).length - 1 ? 0 : 1
                  }}
                >
                  <LeftCover key={index}>
                    <Text
                      style={{
                        fontSize: fonts.LARGE_SIZE,
                        color: colors.BLACK,
                        fontFamily: fonts.WORK_SANS_REGULAR
                      }}
                    >
                      {key}
                    </Text>
                  </LeftCover>
                  <RightCover>
                    <Text
                      style={{
                        fontSize: fonts.LARGE_SIZE,
                        color: colors.BLACK,
                        fontFamily: fonts.WORK_SANS_REGULAR
                      }}
                    >
                      {currentItem[key]}
                    </Text>
                  </RightCover>
                </Cover>
              ))}
            </View>
          </View>
        </Overlay>
      </Modal>
    </Container>
  );
}
