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
import ActiveMember from './widget';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp extends NavigationInterface {
  isVisible: boolean;
  closeActiveModal(): void;
}

function ActiveModal(props: ModalProp) {
  const { isVisible, closeActiveModal, navigation } = props;

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
        onClose={closeActiveModal}
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
            {t(`community.tabPanel.active`)}
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
          {NearbyMembers?.map((member: any, index: number) => (
            <ActiveMember
              key={member.id}
              {...member}
              index={index}
              lastChild={NearbyMembers.length - 1}
              navigation={navigation}
              closeActiveModal={closeActiveModal}
            />
          ))}
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(ActiveModal);
