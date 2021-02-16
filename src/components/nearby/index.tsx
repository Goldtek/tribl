import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import {
  GET_NEARBY_MEMBERS,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import NearbyMember from './widget';
import Skeleton from './widget/skeleton';
import {
  PassportInterface,
  NearbyMembersRequestInterface
} from '../../graphql/types';
import { PAGINATION_DEFAULT } from '../../constants';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeNearbyModal(): void;
}

function NearbyModal(props: ModalProp) {
  const { isVisible, closeNearbyModal } = props;

  const { colors, fonts } = useThemeContext();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data: nearbyData } = useQuery<NearbyMembersRequestInterface>(
    GET_NEARBY_MEMBERS
  );

  const nearbyMember = nearbyData?.nearbyMembers?.data;

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;

  const nearbyList = nearbyMember?.slice().sort((a, b) => {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const filterMembers = nearbyList?.filter((member) => member.id !== userId);

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    isVisible ? openModal() : closeModal();
  }, [isVisible]);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <NearbyMember key={item.id} {...item} NearbyUserModal={closeNearbyModal} />
  );

  return (
    <Portal>
      <StatusBar translucent animated style="light" />
      <Modalize
        ref={modalizeRef}
        onClose={closeNearbyModal}
        modalStyle={{
          height: DEVICE_FULL_HEIGHT / 2,
          paddingTop: RFValue(30),
          paddingBottom: RFValue(20),
          marginTop: RFValue(90)
        }}
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
        flatListProps={{
          data: filterMembers || [],
          renderItem: _renderItem,
          ListEmptyComponent: <Skeleton />,
          showsVerticalScrollIndicator: false,
          keyExtractor: ({ id }: PassportInterface) => id,
          style: { flex: 1 },
          contentContainerStyle: { flexGrow: 1, paddingBottom: 120 + bottom }
        }}
      />
    </Portal>
  );
}

export default React.memo(NearbyModal);
