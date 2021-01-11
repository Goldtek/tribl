import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { Title, Paragraph } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../../components/gradientButton';
import { useThemeContext } from '../../../../theme';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import { GET_ALL_INTEREST } from '../../../../graphql/server/query';
import { InterestInterface } from '../../../../graphql/types';
import InterestButton from './interestButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function InterestModal(props: any) {
  const { isVisible, closeIdentityModal } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({
    selectedInterests: new Map(),
    selectedId: new Map()
  });

  const { data } = useQuery<InterestInterface>(GET_ALL_INTEREST);

  const handleSelect = (selected: string, id: string) => {
    if (!state.selectedInterests.has(selected)) {
      props.interest(state.selectedInterests, state.selectedId);
      return setState({
        ...state,
        selectedInterests: new Map(
          state.selectedInterests.set(selected, selected)
        ),
        selectedId: new Map(state.selectedId.set(id, id))
      });
    }

    state.selectedInterests.delete(selected);
    state.selectedId.delete(id);
    props.interest(state.selectedInterests, state.selectedId);
    setState({
      ...state,
      selectedInterests: new Map(state.selectedInterests),
      selectedId: new Map(state.selectedId)
    });
  };

  const interests = Array.from(new Set(data?.Interest));

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
            {t(`community.memberPassport.interestTitle`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`community.memberPassport.interestParagraph`)}
          </Paragraph>

          <Container
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: RFValue(20)
            }}
          >
            {interests?.map((interest) => {
              return (
                <InterestButton
                  key={interest.id}
                  interest={interest.name}
                  selected={
                    state.selectedInterests.get(interest.name) &&
                    state.selectedId.get(interest.id)
                  }
                  id={interest.id}
                  handleSelect={handleSelect}
                />
              );
            })}
          </Container>

          <Container
            style={{ marginTop: RFValue(10), marginBottom: RFValue(50) }}
          >
            <GradientButton onPress={() => closeModal()}>
              {t(`signup.identifyUserScreen.done`)}
            </GradientButton>
          </Container>
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(InterestModal);
