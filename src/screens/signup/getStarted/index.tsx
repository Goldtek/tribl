import React, { useState, Fragment } from 'react';
import {
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Title, Subheading, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import Input from '../../../common/input';
import Countries from '../../../libs/countries';
import { GET_USER_COUNTRY } from '../../../graphql/cache/query';
import { StoreInterface } from '../../../graphql/types';
import { DEVICE_OS } from '../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, GradientContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function GetStartedScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_COUNTRY);

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    number: '',
    loading: false
  });

  const handleSubmit = () => {
    setState({ ...state, loading: true });

    setTimeout(() => {
      navigation.navigate('OTPScreen');
      setState({ ...state, loading: false });
    }, 1000);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: colors.WHITE,
        padding: 20
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={DEVICE_OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Fragment>
            <Container
              style={{
                height: '40%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <Image
                source={require('../../../../assets/images/icon.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(60),
                  height: RFValue(60)
                }}
              />
            </Container>

            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.8)),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: RFValue(30)
              }}
            >
              {t(`signup.screenOne.title`)}
            </Title>
            <Subheading
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.SECONDARY_TEXT
              }}
            >
              {t(`signup.screenOne.subTitle`)}
            </Subheading>
            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginTop: 30
              }}
            >
              {t(`signup.screenOne.mobileNumber`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.screenOne.placeholder`)}
              defaultValue={state.number}
              onChangeText={(number) => setState({ ...state, number })}
              keyboardType="phone-pad"
              returnKeyType="done"
              secureTextEntry
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('SelectCountryScreen')}
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 15
                }}
              >
                <Fragment>
                  <Image
                    style={{
                      width: RFValue(25),
                      height: RFValue(30),
                      resizeMode: 'contain'
                    }}
                    //@ts-ignore
                    source={Countries.getFlag(data?.countryCode)}
                  />
                  <Container
                    style={{
                      height: RFValue(30),
                      margin: RFValue(10),
                      borderWidth: 0.7,
                      borderColor: colors.INACTIVE
                    }}
                  />
                </Fragment>
              </TouchableOpacity>
            </Input>

            <GradientContainer
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[colors.PRIMARY, colors.SECONDARY]}
              style={{ borderRadius: 4, marginTop: RFValue(20) }}
            >
              <Button
                mode="text"
                color={colors.WHITE}
                uppercase={false}
                loading={state.loading}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
                contentStyle={{ height: RFValue(60) }}
                style={{ width: '100%', height: RFValue(60) }}
                onPress={handleSubmit}
              >
                {t(`signup.screenOne.${state.loading ? 'loading' : 'submit'}`)}
              </Button>
            </GradientContainer>

            <Container
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: RFValue(30)
              }}
            >
              <Subheading
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.SECONDARY_TEXT
                }}
              >
                {t(`signup.screenOne.gotAnAccount`)}
              </Subheading>

              <Button
                mode="text"
                color={colors.WHITE}
                uppercase={false}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY,
                  textTransform: 'capitalize',
                  right: RFValue(8)
                }}
                onPress={() => navigation.navigate('LoginScreen')}
              >
                {t('signup.screenOne.login')}
              </Button>
            </Container>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
