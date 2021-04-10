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
import {
  GET_ALL_IDENTITIES,
  GET_USER_PASSPORT
} from '../../../../graphql/server/query';
import {
  IdentitiesInterface,
  MyPassportInterface
} from '../../../../graphql/types';
import IdentityButton from './identityButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

export interface IdentityInterface {
  name: string;
  id: string;
}

function IdentityModal(props: any) {
  const { isVisible, closeIdentityModal } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [selectedIdentities, setSelectedIdentities] = useState<{
    [key: string]: IdentityInterface;
  }>({});

  const { data } = useQuery<IdentitiesInterface>(GET_ALL_IDENTITIES, {
    variables: {
      input: { limit: 50, filter: { isAdmin: true } }
    }
  });

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  useEffect(() => {
    if (userDetails) {
      const identities = userDetails?.identity.reduce((acc, identity) => {
        //@ts-ignore
        if (!acc[identity.id]) {
          //@ts-ignore
          acc[identity.id] = identity;
        }
        return acc;
      }, {});

      setSelectedIdentities({ ...selectedIdentities, ...identities });
    }
  }, [userDetails]);

  const handleSelect = (identity: IdentityInterface) => {
    let action = 'removeIdentity';
    if (!selectedIdentities[identity.id]) {
      action = 'addIdentity';
      props.identity(identity, action);
      return setSelectedIdentities({
        ...selectedIdentities,
        [identity.id]: identity
      });
    }

    props.identity(identity, action);
    const { [identity.id]: deletedIdentity, ...rest } = selectedIdentities;
    setSelectedIdentities({ ...rest });
  };

  const identities = Array.from(new Set(data?.Identity?.data));

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
            {identities?.map((identity) => {
              return (
                <IdentityButton
                  key={identity.id}
                  identity={identity}
                  selected={Boolean(selectedIdentities[identity.id])}
                  handleSelect={() => handleSelect(identity)}
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

export default React.memo(IdentityModal);
