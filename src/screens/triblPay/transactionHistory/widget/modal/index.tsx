import React from 'react';
import { useThemeContext } from '../../../../../theme';
import { Modal, View } from 'react-native';
import { Title, Text, Button, Divider } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import FastImage from 'react-native-fast-image';
import { format } from 'date-fns';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

import { Overlay, Cover, LeftCover, RightCover, BalanceCover } from './styles';

const ModalItem = ({ label, value }: { label: string; value: string }) => {
  const { colors, fonts } = useThemeContext();
  return (
    <Cover
      style={{
        paddingVertical: RFValue(15),
        marginHorizontal: RFValue(20),

        // borderBottomColor: colors.BLACK,
        borderColor: colors.INACTIVE,
        borderBottomWidth: 1
      }}
    >
      <LeftCover>
        <Text
          style={{
            fontSize: fonts.LARGE_SIZE,
            color: colors.BLACK,
            fontFamily: fonts.WORK_SANS_REGULAR
          }}
        >
          {label}
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
          {value}
        </Text>
      </RightCover>
    </Cover>
  );
};

export default function TransactionModal({
  onClose,
  isOpen,
  data
}: ModalProps) {
  console.log(data);
  const { colors, fonts } = useThemeContext();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Overlay activeOpacity={1} onPress={onClose}>
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
              {data.narration}
            </Title>
            <Divider />
            <BalanceCover style={{ paddingVertical: RFValue(15) }}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: data.avatar,
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
                {`${data?.salePrice} ${data?.asset}`}
              </Text>
              <Text
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  fontFamily: fonts.WORK_SANS_REGULAR
                }}
              >
                {`$${data?.equivalent}`}
              </Text>
            </BalanceCover>
            <Divider />
            <ModalItem
              label="Price"
              value={
                data.asset === 'USD'
                  ? `$${data.costPrice}`
                  : `${data.salePrice} per ${data.asset}`
              }
            />
            <ModalItem label="Payment Method" value="Default" />
            <ModalItem label="Fee" value={`$${data.fees}`} />
            <ModalItem
              label="Date"
              value={format(
                new Date(parseInt(data.createdAt)),
                'hh:mm a - MMMM d'
              )}
            />

            <ModalItem label="Status" value={data.status || 'Complete'} />
          </View>
        </View>
      </Overlay>
    </Modal>
  );
}
