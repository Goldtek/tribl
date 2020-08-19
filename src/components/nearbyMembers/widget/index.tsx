import React, { Fragment } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { TextConatiner } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularUserProp {
  avatar: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  currentLocation: {
    country: string;
    state: string;
  }[];
  navigation: any;
  closeNearbyModal(): void;
}

function PopularCommunity(props: PopularUserProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const {
    avatar = 'https://picsum.photos/700',
    firstName,
    lastName,
    currentLocation,
    phoneNumber,
    navigation,
    closeNearbyModal
  } = props;

  const handleNavigation = () => {
    closeNearbyModal();
    navigation.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...props }
    });
  };

  const { state, country } = currentLocation[0];

  return (
    <Fragment>
      <TouchableRipple
        onPress={handleNavigation}
        rippleColor={colors.PRIMARY}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 15,
          marginBottom: RFValue(20)
        }}
      >
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(10)
            }}
          />
          <TextConatiner>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: fonts.LARGE_SIZE + 1,
                lineHeight: RFValue(18),
                textTransform: 'capitalize'
              }}
            >
              {`${firstName} ${lastName}`}
            </Title>
            <Paragraph
              style={{
                fontSize: fonts.LARGE_SIZE,
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${state}, ${country}`}
            </Paragraph>
          </TextConatiner>
          <Button
            loading={false}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              backgroundColor: colors.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{
              borderRadius: 5,
              width: RFValue(65),
              height: RFValue(30),
              marginRight: RFValue(15)
            }}
            onPress={() => {}}
          >
            {t(`community.recommended.add`)}+
          </Button>
        </Fragment>
      </TouchableRipple>
    </Fragment>
  );
}

export default React.memo(PopularCommunity, () => false);
