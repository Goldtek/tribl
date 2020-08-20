import React, { Fragment } from 'react';
import { Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeArea } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { FlatList, TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import { Feather } from '@expo/vector-icons';
import ConnectionRequest from './widget';
import { StatusBar } from 'expo-status-bar';
import { GET_CONNECTION_REQUEST } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionRequestScreenProp extends NavigationInterface {}

export default function ConnectionRequestScreen(
  props: ConnectionRequestScreenProp
) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeArea();
  const { t } = useTranslation();

  const { data, refetch } = useQuery(GET_CONNECTION_REQUEST);

  const myConnection = data?.connectionRequests;

  const _renderItem = ({ item }: any) => (
    <ConnectionRequest key={item.id} {...item} {...props} refetch={refetch} />
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
            onPress={props.navigation.toggleDrawer}
            underlayColor={hexToRGB(colors.PRIMARY, 0.1)}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              borderRadius: RFValue(20),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Feather
              name="menu"
              size={RFValue(25)}
              color={colors.PRIMARY_TEXT}
            />
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        {myConnection?.length ? (
          <Fragment>
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
              {t(`community.tabPanel.memberTitle`)}
            </Title>
            <FlatList
              data={myConnection}
              contentContainerStyle={{
                flexGrow: 1,
                marginTop: RFValue(10),
                paddingBottom: RFValue(120)
              }}
              showsVerticalScrollIndicator={false}
              renderItem={_renderItem}
              keyExtractor={(item) => item.id}
            />
          </Fragment>
        ) : (
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
        )}
      </Container>
    </Fragment>
  );
}
