import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { Text, Title, Paragraph } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../../../components/gradientButton';
import { useThemeContext } from '../../../../../theme';
import { DEVICE_FULL_HEIGHT } from '../../../../../utils/device';
import { GET_ALL_IDENTITIES } from '../../../../../graphql/server/query';
import { IdentitiesInterface } from '../../../../../graphql/types';
import IdentityButton from './identityButton';
import { ADD_USER_DETAILS } from '../../../../../graphql/cache/mutations';

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
    selectedIdentities: new Map(),
    selectedId: new Map()
  });

  const { data } = useQuery<IdentitiesInterface>(GET_ALL_IDENTITIES, {
    variables: {
      input: { filter: { isAdmin: true } }
    }
  });

  const handleSelect = (selected: string, id: string) => {
    if (!state.selectedIdentities.has(selected)) {
      props.identity(state.selectedIdentities, state.selectedId);
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
    props.identity(state.selectedIdentities, state.selectedId);
    setState({
      ...state,
      selectedIdentities: new Map(state.selectedIdentities),
      selectedId: new Map(state.selectedId)
    });
  };

  const SelectedIdentitiesID = Array.from(state.selectedId.values());

  const [addUserDetails] = useMutation(ADD_USER_DETAILS, {
    variables: {
      details: {
        identity: SelectedIdentitiesID
      }
    }
  });
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
            {data?.Identity?.data?.map((identity) => {
              return (
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
              );
            })}
          </Container>

          <Container
            style={{ marginTop: RFValue(10), marginBottom: RFValue(50) }}
          >
            <GradientButton
              onPress={() => {
                closeModal();
                setTimeout(() => addUserDetails(), 0);
              }}
            >
              {t(`signup.identifyUserScreen.done`)}
            </GradientButton>
          </Container>
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(IdentityModal);
