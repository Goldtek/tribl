import React, { useState, useEffect, Fragment } from 'react';
import {
  Title,
  Text,
  ProgressBar,
  Paragraph,
  TouchableRipple
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import ENVIRONMENT_VARIABLES from 'react-native-config';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import Input from '../../../components/input';
import GradientButton from '../../../components/gradientButton';

import { Container, HeaderCover } from './styles';
import { View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import { initSession } from '../../../vouched/session';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

initSession(ENVIRONMENT_VARIABLES.PUBLIC_KEY);
export default function DocumentTypeSelectionScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const details = props.route?.params?.details;
  const { name, iso2, emoji } = details;

  const [docType, setDocType] = useState('');

  useEffect(() => {
    tagScreenName('DocumentTypeSelectionScreen');
    logEvent('Select document type', { from: 'passport' });
  }, []);

  const handleNavigation = () => {
    if (docType === 'id')
      return navigation.navigate('CountryIdScreen', {
        details: { docType, name, iso2, emoji }
      });
    navigation.navigate('PassportIdScreen', {
      details: { docType, name, iso2, emoji }
    });
  };

  const handleDocSelection = (doc: string) => setDocType(doc);

  return (
    <Container>
      <HeaderCover>
        <ProgressBar
          progress={2 / 3}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: 10
          }}
        />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE - 1),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            marginTop: RFValue(15),
            lineHeight: RFValue(19)
          }}
        >
          {' '}
          {t(`community.passport.step`)} 2
        </Text>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            lineHeight: RFValue(30)
          }}
        >
          Document type selection
        </Title>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            color: colors.SECONDARY_TEXT,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            lineHeight: RFValue(19)
          }}
        >
          Select between license or passport scanning. Keep the document close
          and make sure is in good condition.
        </Text>

        <TouchableRipple
          onPress={() => handleDocSelection('passport')}
          style={{
            flexDirection: 'row',
            borderColor: colors.PRIMARY,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: RFValue(10),
            marginVertical: RFValue(10)
          }}
        >
          <Fragment>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="passport"
                size={50}
                color={colors.PRIMARY}
              />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 3),
                  color: colors.SECONDARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: RFValue(19),
                  marginLeft: RFValue(10)
                }}
              >
                Passport
              </Text>
            </View>
            <CheckBox
              disabled={true}
              value={docType === 'passport'}
              tintColors={{
                true: colors.PRIMARY,
                false: colors.INACTIVE
              }}
              animationDuration={0.2}
              tintColor={colors.INACTIVE}
              onCheckColor={colors.WHITE}
              onFillColor={colors.PRIMARY}
              onTintColor={colors.PRIMARY}
              style={{ width: RFValue(20), height: RFValue(20) }}
            />
          </Fragment>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => handleDocSelection('id')}
          style={{
            flexDirection: 'row',
            borderColor: colors.PRIMARY,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: RFValue(10),
            marginVertical: RFValue(10)
          }}
        >
          <Fragment>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="idcard" size={50} color={colors.PRIMARY} />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 3),
                  color: colors.SECONDARY_TEXT,
                  lineHeight: RFValue(19),
                  marginLeft: RFValue(10)
                }}
              >
                ID Card
              </Text>
            </View>
            <CheckBox
              disabled={true}
              value={docType === 'id'}
              tintColors={{
                true: colors.PRIMARY,
                false: colors.INACTIVE
              }}
              animationDuration={0.2}
              tintColor={colors.INACTIVE}
              onCheckColor={colors.WHITE}
              onFillColor={colors.PRIMARY}
              onTintColor={colors.PRIMARY}
              style={{ width: RFValue(20), height: RFValue(20) }}
            />
          </Fragment>
        </TouchableRipple>
      </HeaderCover>
      <GradientButton
        onPress={handleNavigation}
        style={{ height: 50 }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30),
          marginHorizontal: RFValue(15)
        }}
        contentStyle={{ height: 50 }}
      >
        {t(`community.passport.next`)}
      </GradientButton>
    </Container>
  );
}
