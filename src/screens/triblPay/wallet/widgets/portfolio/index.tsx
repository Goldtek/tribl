import React from 'react';
import { Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';
import { Cover, LeftCover, RightCover, Icon } from './styles';
import { useNavigation } from '@react-navigation/native';

// @ts-ignore
import bitcoin from '../../../../../../assets/images/bitcoin.png';
// @ts-ignore
import etherum from '../../../../../../assets/images/etherum.jpeg';
// @ts-ignore
import tribl from '../../../../../../assets/images/tribl.png';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';

interface ItemProps {
  item: Item;
  markets: [Market];
}

interface Item {
  asset: string;
  available: string;
  trading: string;
}

interface Market {
  market: string;
  best_bid: Rate;
  best_ask: Rate;
}

interface Rate {
  amount?: number;
  price: number;
}

export default function Portfolio(props: ItemProps) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { item, markets } = props;
  let price: Number = Number(item.available);

  for (let each_market of markets) {
    if (each_market.market === 'ETHUSD' && item.asset === 'ETH') {
      price = each_market.best_ask.price * Number(item.available);
    } else if (each_market.market === 'BTCUSD' && item.asset === 'BTC') {
      price = each_market.best_ask.price * Number(item.available);
    }
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigate('CryptoTransactionHistoryScreen', { price, asset: item.asset })
      }
    >
      <Cover>
        <LeftCover>
          <Icon
            source={
              item.asset === 'ETH'
                ? etherum
                : item.asset === 'USD'
                ? tribl
                : bitcoin
            }
          />
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.SMALL_SIZE + 3),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {item.asset === 'ETH'
              ? t(`community.currency.etherum`)
              : item.asset === 'USD'
              ? t(`community.currency.tribl`)
              : t(`community.currency.bitcoin`)}
          </Text>
        </LeftCover>
        <RightCover style={{}}>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(17)
            }}
          >
            {'\u0024'}
            {Math.ceil(Number(price))}
          </Text>
        </RightCover>
      </Cover>
    </TouchableOpacity>
  );
}
