import React, { Fragment } from 'react';
import { NavigationInterface } from '../../types';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeArea } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import { Entypo } from '@expo/vector-icons';
import AlgoliaSearch from '../../../components/algoliaSearch';
import AlgoliaList from '../../../components/algoliaInboxList';
import Connection from './widget';
import { GET_MY_CONNECTIONS } from '../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeArea();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data } = useQuery(GET_MY_CONNECTIONS);

  const myConnection = data?.myConnections;

  const _renderItem = ({ item }: any) => (
    <Connection key={item.id} {...item} {...props} />
  );

  return (
    <Fragment>
      <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
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
            {t(`community.sideNav.connection`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableRipple onPress={() => props.navigation.goBack()}>
            <Entypo name="chevron-left" size={25} color={colors.PRIMARY} />
          </TouchableRipple>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        <AlgoliaSearch indexName="tribl_passport_staging">
          <AlgoliaList />
        </AlgoliaSearch>
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
            You currently don't have any connection
          </Text>
        )}
      </Container>
    </Fragment>
  );
}
