import React, { useEffect, Fragment, useState } from 'react';
import { Text, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import BlockedUser from './widget';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import Header from '../../../components/header';
import { useThemeContext } from '../../../theme';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BlockeAccounts(props: ScreenProp) {
  const { navigation, route } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [blockedAccounts, setBlockedAccounts] = useState(
    route?.params?.details
  );

  const { data: userData, refetch } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;

  useEffect(() => {
    if (userDetails) {
      setBlockedAccounts(userDetails?.privacy?.blocked);
    }
  }, [userDetails]);

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <BlockedUser key={item.id} {...item} refetch={refetch} />
  );

  return (
    <Fragment>
      <StatusBar translucent style="dark" />
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
            {t(`community.accountSettings.blocked`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableRipple
            onPress={() => navigation.goBack()}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40 / 2,
              marginRight: 10
            }}
          >
            <Ionicons name="md-arrow-back" size={24} color={colors.PRIMARY} />
          </TouchableRipple>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        <FlatList
          data={blockedAccounts}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: RFValue(10),
            paddingBottom: RFValue(60)
          }}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                margin: RFValue(20),
                textAlign: 'center'
              }}
            >
              You have not blocked any account
            </Text>
          }
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          keyExtractor={({ id }) => id}
        />
      </Container>
    </Fragment>
  );
}
