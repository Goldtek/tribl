import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { ProgressBar, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import IdentityButton from './widgets/identityButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  identities: string[];
}

export default function IdentifyUserScreen(props: ScreenProp) {
  const { navigation, identities } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState<{ [name: string]: string }>({});

  const handleSubmit = () => {
    navigation.navigate('UserLocationScreen');
  };

  const handleSelect = (selected: string) => {
    if (!state[selected]) return setState({ ...state, [selected]: selected });

    const { [selected]: removedSelected, ...rest } = state;

    setState({ ...rest });
  };

  return (
    <Container
      style={{
        height: '100%',
        paddingLeft: RFValue(20),
        paddingRight: RFValue(20)
      }}
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
          {t(`signup.screenSix.subTitle`)}
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
          {t(`signup.screenSix.title`)}
        </Title>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.SECONDARY_TEXT,
            lineHeight: RFValue(22)
          }}
        >
          {t(`signup.screenSix.paragraph`)}
        </Paragraph>

        <Container
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: RFValue(20)
          }}
        >
          {identities.map((identity) => (
            <IdentityButton
              key={identity.toLowerCase()}
              {...{ identity, handleSelect, state }}
            />
          ))}
        </Container>

        <Container style={{ marginTop: RFValue(40) }}>
          <GradientButton onPress={handleSubmit}>
            {t(`signup.screenSix.submit`)}
          </GradientButton>
        </Container>
      </ScrollView>
    </Container>
  );
}

IdentifyUserScreen.defaultProps = {
  identities: [
    'Afro-Indian',
    'Creole',
    'Caribbean',
    'Afro-Latin',
    'Afro-Canadian',
    'Afro-Asian',
    'West African',
    'African',
    'East African',
    'Black',
    'Afro-European',
    'gullah',
    'diaspora',
    'Mixed',
    'African American'
  ]
};
