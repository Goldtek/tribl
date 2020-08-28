import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { Text, Title, Paragraph } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RFValue } from 'react-native-responsive-fontsize';
import { Toast } from '../../../../components/rootToaster';
import GradientButton from '../../../../components/gradientButton';
import { useThemeContext } from '../../../../theme';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import { GET_ALL_IDENTITIES } from '../../../../graphql/server/query';
import { IdentitiesInterface } from '../../../../graphql/types';
import IdentityButton from './identityButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function IdentityModal(props: any) {
  const { isVisible, closeIdentityModal } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({
    selectedIdentities: new Map()
  });

  const { data } = useQuery<IdentitiesInterface>(GET_ALL_IDENTITIES);

  //   const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
  //     variables: {
  //       details: {
  //         identity: [...Array.from(state.selectedIdentities.values())]
  //       }
  //     }
  //   });

  const handleSelect = (selected: string) => {
    if (!state.selectedIdentities.has(selected)) {
      props.identity(state.selectedIdentities);
      return setState({
        ...state,
        selectedIdentities: new Map(
          state.selectedIdentities.set(selected, selected)
        )
      });
    }

    state.selectedIdentities.delete(selected);
    props.identity(state.selectedIdentities);
    setState({
      ...state,
      selectedIdentities: new Map(state.selectedIdentities)
    });
  };

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClose={closeIdentityModal}
        modalStyle={{ marginTop: RFValue(30) }}
        modalHeight={DEVICE_FULL_HEIGHT}
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            paddingHorizontal: RFValue(15)
          }}
        >
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
            {data?.Identity?.map((identity) => (
              <IdentityButton
                key={identity.id}
                identity={identity.name}
                selected={state.selectedIdentities.get(identity.name)}
                handleSelect={handleSelect}
              />
            ))}
          </Container>

          <Container style={{ marginTop: RFValue(10) }}>
            <GradientButton onPress={() => closeModal()}>
              {t(`signup.identifyUserScreen.done`)}
            </GradientButton>
          </Container>
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(IdentityModal);
