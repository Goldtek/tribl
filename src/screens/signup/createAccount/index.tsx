import React, { useState, Fragment } from 'react';
import { ProgressBar, Title, Paragraph, Snackbar } from 'react-native-paper';
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
import { CreateAccountInterface } from '../../../graphql/types';
import { CREATE_USER_ACCOUNT } from '../../../graphql/server/mutations';
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
    inputError: false,
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

  const [createPassport] = useMutation<CreateAccountInterface>(
    CREATE_USER_ACCOUNT,
    {
      variables: {
        payload: {
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email
        }
      }
    }
  );

  const handleInputError = () => {
    setState({ ...state, inputError: !state.inputError });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const { firstName, lastName, email } = state;

    if (!firstName && !lastName && !email) {
      return handleInputError();
    }

    setState({ ...state, loading: true });

    setTimeout(() => {
      setState({ ...state, loading: false, isModalVisible: true });
    }, 500);

    setTimeout(async () => {
      const response = await createPassport();
      if (response.data?.success) {
        addUserDetails().finally(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AvatarUploadScreen' }]
          });
        });
      }
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
            {t(`signup.createAccountScreen.subTitle`)}
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
            {t(`signup.createAccountScreen.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.createAccountScreen.paragraph`)}
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
              {t(`signup.createAccountScreen.firstName`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.createAccountScreen.firstName`)}
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
              {t(`signup.createAccountScreen.lastName`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.createAccountScreen.lastName`)}
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
              {t(`signup.createAccountScreen.email`)}
            </Paragraph>

            <Input
              placeholder={t(`signup.createAccountScreen.email`)}
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
                `signup.createAccountScreen.${
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

      <Snackbar
        duration={Snackbar.DURATION_SHORT}
        visible={state.inputError}
        onDismiss={handleInputError}
        action={{ label: 'Dismiss', onPress: handleInputError }}
        wrapperStyle={{ paddingLeft: 10, paddingRight: 10 }}
      >
        {t(`signup.createAccountScreen.inputError`)}
      </Snackbar>
    </Fragment>
  );
}
