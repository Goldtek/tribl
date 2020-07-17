import React, { useState, Fragment } from 'react';
import { ProgressBar, Title, Paragraph } from 'react-native-paper';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import GradientButton from '../../../components/gradientButton';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { useMutation } from '@apollo/react-hooks';
import Input from '../../../components/input';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import LoadingModal from '../../../components/loading';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreateAccountScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    loading: false,
    isModalVisible: false
  });

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      payload: {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email
      }
    }
  });

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setState({ ...state, loading: true });

    // await addUserDetails();
    setState({ ...state, loading: false, isModalVisible: true });

    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'AvatarUploadScreen' }] });
      setState({ ...state, loading: false, isModalVisible: false });
    }, 5000);
  };

  return (
    <Fragment>
      <Container
        style={{
          height: '100%',
          paddingLeft: RFValue(20),
          paddingRight: RFValue(20)
        }}
      >
        <ProgressBar
          progress={2 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: 10
          }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="position"
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={-50}
        >
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
              color: colors.PRIMARY,
              textTransform: 'capitalize',
              lineHeight: RFValue(30)
            }}
          >
            {t(`signup.screenFour.subTitle`)}
          </Title>

          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
              color: colors.PRIMARY_TEXT,
              lineHeight: RFValue(30),
              marginTop: 20
            }}
          >
            {t(`signup.screenFour.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.screenFour.paragraph`)}
          </Paragraph>

          <Container>
            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginTop: 30
              }}
            >
              {t(`signup.screenFour.firstName`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.screenFour.firstName`)}
              defaultValue={state.firstName}
              onChangeText={(firstName) => setState({ ...state, firstName })}
              returnKeyType="next"
              textInputStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR
              }}
            />

            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginTop: 20
              }}
            >
              {t(`signup.screenFour.lastName`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.screenFour.lastName`)}
              defaultValue={state.lastName}
              onChangeText={(lastName) => setState({ ...state, lastName })}
              returnKeyType="next"
              textInputStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR
              }}
            />

            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'uppercase',
                marginTop: 20
              }}
            >
              {t(`signup.screenFour.email`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.screenFour.email`)}
              defaultValue={state.email}
              onChangeText={(email) => setState({ ...state, email })}
              keyboardType="email-address"
              returnKeyType="done"
              textInputStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR
              }}
            />
          </Container>

          <Container
            style={{
              justifyContent: 'flex-end',
              paddingBottom: RFValue(safeAreaBottom + 30),
              marginTop: RFValue(
                safeAreaBottom + DEVICE_FULL_WIDTH <= 375 ? 30 : 60
              )
            }}
          >
            <GradientButton loading={state.loading} onPress={handleSubmit}>
              {t(
                `signup.screenFour.${
                  state.loading ? 'loading' : 'createAccount'
                }`
              )}
            </GradientButton>
          </Container>
        </KeyboardAvoidingView>
      </Container>

      <LoadingModal
        title={`Tiffany, ${t('signup.settingPassport')}`}
        isVisible={state.isModalVisible}
      />
    </Fragment>
  );
}
