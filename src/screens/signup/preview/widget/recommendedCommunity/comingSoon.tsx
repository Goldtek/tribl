import React from 'react';
import { Text, Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';

function ComingSoonCommunity() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Card
      style={{
        width: DEVICE_FULL_WIDTH - 30,
        height: RFValue(200),
        alignSelf: 'center',
        backgroundColor: colors.BLACK,
        marginTop: 3,
        marginBottom: 3,
        marginHorizontal: 'auto',
        elevation: 0
      }}
    >
      <Card.Content
        style={{
          width: DEVICE_FULL_WIDTH - 30,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <Text
          style={{
            color: colors.WHITE,
            fontSize: RFValue(fonts.LARGE_SIZE + 12),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            textAlign: 'center',
            textTransform: 'capitalize'
          }}
        >
          {' '}
          {t(`community.recommended.newCommunity`)}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default React.memo(ComingSoonCommunity);
