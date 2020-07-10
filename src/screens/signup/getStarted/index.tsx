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
import Input from '../../../components/input';
import Countries from '../../../libs/countries';
import { GET_USER_COUNTRY } from '../../../graphql/cache/query';
import { StoreInterface } from '../../../graphql/types';
import { DEVICE_OS } from '../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import GradientButton from '../../../components/gradientButton';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function GetStartedScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_COUNTRY);

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({ number: '', loading: false });

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

            <Container style={{ flex: 1, paddingTop: RFValue(20) }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
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

              <GradientButton loading={state.loading} onPress={handleSubmit}>
                {t(`signup.screenOne.${state.loading ? 'loading' : 'submit'}`)}
              </GradientButton>
            </Container>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
