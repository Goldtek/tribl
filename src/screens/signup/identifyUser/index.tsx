import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { ProgressBar, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { Mixpanel } from '../../../config';
import { useTranslation } from 'react-i18next';
import { Toast } from '../../../components/rootToaster';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import IdentityButton from './widgets/identityButton';
import ScrollInstruction from './widgets/scrollInstruction';
import { GET_ALL_IDENTITIES } from '../../../graphql/server/query';
import { IdentitiesInterface } from '../../../graphql/types';
import Storage from '../../../libs/storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function IdentifyUserScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    selectedIdentities: new Map(),
    selectedId: new Map(),
    showInstruction: true
  });

  const { data } = useQuery<IdentitiesInterface>(GET_ALL_IDENTITIES);

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      details: {
        identity: [...Array.from(state.selectedId.values())]
      }
    }
  });

  useEffect(() => {
    tagScreenName('IdentifyUserScreen');
    logEvent('select identity', { from: 'signup' });
    Mixpanel.track('Avatar Upload', {
      info: 'User on identity selection screen',
      'Activity Screen': 'User Identity Selection Screen'
    });
  }, []);

  const handleInputError = () => {
    Toast.show(t(`signup.identifyUserScreen.inputError`));
  };

  const handleInstruction = () => {
    setState({ ...state, showInstruction: false });
  };

  const identities = Array.from(new Set(data?.Identity?.data));

  const handleSubmit = async () => {
    if (!state.selectedIdentities.size) return handleInputError();
    const selectedIdentities = [
      ...Array.from(state.selectedIdentities.values())
    ];

    Mixpanel.people_union('User Selected Identities', [...selectedIdentities]);

    await Storage.setUserRegistration({
      route: 'UserLocationScreen',
      user: {
        identity: [...Array.from(state.selectedId.values())],
        identityName: selectedIdentities
      }
    });

    navigation.navigate('UserLocationScreen');
    addUserDetails();
  };

  const handleSelect = (selected: string, id: string) => {
    if (!state.selectedIdentities.has(selected)) {
      return setState({
        ...state,
        selectedIdentities: new Map(
          state.selectedIdentities.set(selected, selected)
        ),
        selectedId: new Map(state.selectedId.set(id, id))
      });
    }

    state.selectedIdentities.delete(selected);
    state.selectedId.delete(id);
    setState({
      ...state,
      selectedIdentities: new Map(state.selectedIdentities),
      selectedId: new Map(state.selectedId)
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container
        style={{ paddingLeft: RFValue(20), paddingRight: RFValue(20) }}
      >
        <ProgressBar
          progress={4 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: RFValue(30)
          }}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
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
            {t(`signup.identifyUserScreen.subTitle`)}
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
            {t(`signup.identifyUserScreen.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.identifyUserScreen.paragraph`)}
          </Paragraph>

          <Container
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: RFValue(20)
            }}
          >
            {identities?.map((identity) => (
              <IdentityButton
                key={identity.id}
                identity={identity.name}
                selected={
                  state.selectedIdentities.get(identity.name) &&
                  state.selectedId.get(identity.id)
                }
                id={identity.id}
                handleSelect={handleSelect}
              />
            ))}
          </Container>

          <Container style={{ marginTop: RFValue(40) }}>
            <GradientButton onPress={handleSubmit}>
              {t(`signup.identifyUserScreen.submit`)}
            </GradientButton>
          </Container>
        </ScrollView>
      </Container>

      {state.showInstruction ? (
        <ScrollInstruction onPress={handleInstruction} />
      ) : null}
    </SafeAreaView>
  );
}
