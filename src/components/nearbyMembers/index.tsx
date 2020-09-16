import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import { NavigationInterface } from '../../screens/types';
import { GET_NEARBY_MEMBERS } from '../../graphql/server/query';
import NearbyMember from './widget';
import { PassportInterface } from '../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeNearbyModal(): void;
}

function NearbyModal(props: ModalProp) {
  const { isVisible, closeNearbyModal } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: nearbyData } = useQuery(GET_NEARBY_MEMBERS);

  const NearbyMembers = nearbyData?.nearbyMembers;

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
        onClose={closeNearbyModal}
        modalStyle={{ height: DEVICE_FULL_HEIGHT / 2, paddingTop: RFValue(30) }}
        HeaderComponent={
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              lineHeight: 20,
              marginLeft: RFValue(15),
              marginBottom: RFValue(30)
            }}
          >
            {t(`community.tabPanel.nearby`)}
          </Text>
        }
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {NearbyMembers?.map((member: PassportInterface, index: number) => (
            <NearbyMember
              key={member.id}
              {...member}
              closeNearbyModal={closeNearbyModal}
            />
          ))}
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(NearbyModal);
