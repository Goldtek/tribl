import React, { Fragment, useCallback, useEffect } from 'react';
import { Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PTRView from 'react-native-pull-to-refresh';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import ConnectionRequest from './widget';
import { StatusBar } from 'expo-status-bar';
import { GET_CONNECTION_REQUEST } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';
import Skeleton from './widget/connectionRequestSkeleton';
import { PassportInterface } from '../../../graphql/types';
import { CHANGE_CONNECTION_NOTIFICATION_BADGE } from '../../../graphql/cache/mutations';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, MenuBadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionRequestScreenProp extends NavigationInterface {}

export default function ConnectionRequestScreen(
  props: ConnectionRequestScreenProp
) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data, refetch } = useQuery(GET_CONNECTION_REQUEST);
  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const connectionRequest = data?.connectionRequests;

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ConnectionRequest key={item.id} item={item} refetch={refetch} />
  );

  useEffect(() => {
    tagScreenName('ConnectionRequestScreen');
  }, []);

  useFocusEffect(
    useCallback(() => {
      data?.connectionRequests.length
        ? changeConnectionNotification({
            variables: { showConnectionNotificationBadge: true }
          })
        : changeConnectionNotification({
            variables: { showConnectionNotificationBadge: false }
          }).then(refetch);
    }, [data?.connectionRequests.length])
  );

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
      <Header
        title={() => (
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.request`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableHighlight
            {...props}
            onPress={() => {
              navigation.toggleDrawer();
              logEvent('open drawer', { from: 'community' });
            }}
            underlayColor={hexToRGB(colors.PRIMARY, 0.1)}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              borderRadius: RFValue(20),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Fragment>
              <Feather
                name="menu"
                size={RFValue(25)}
                color={colors.PRIMARY_TEXT}
              />
              {data?.connectionRequests.length ? <MenuBadgeWrapper /> : null}
            </Fragment>
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        {connectionRequest?.length ? (
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              marginTop: RFValue(20),
              marginLeft: RFValue(10),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.request`)}
          </Title>
        ) : null}

        <PTRView onRefresh={refetch} style={{ marginTop: RFValue(10) }}>
          {connectionRequest ? (
            <FlatList
              data={connectionRequest}
              contentContainerStyle={{
                flexGrow: 1,
                marginTop: RFValue(10),
                paddingBottom: RFValue(120)
              }}
              renderItem={_renderItem}
              ListEmptyComponent={
                <Text
                  style={{
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    fontFamily: fonts.WORK_SANS_BOLD,
                    margin: RFValue(20),
                    textAlign: 'center'
                  }}
                >
                  You don't have any connection request.
                </Text>
              }
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Skeleton />
          )}
        </PTRView>
      </Container>
    </Fragment>
  );
}
