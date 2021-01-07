import React, { Fragment, useEffect } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Feather } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import { StatusBar } from 'expo-status-bar';
import { GET_SIDE_MENU_STATE } from '../../../graphql/cache/query';
import { GET_CONNECTION_REQUEST } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';
import { TOGGLE_SIDE_MENU } from '../../../graphql/cache/mutations';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import {
  ConnectionRequestsInterface,
  ShowSideMenu
} from '../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Welcome, MenuBadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface PrivacyPolicyScreenProp extends NavigationInterface {}

export default function PrivacyPolicyScreen(props: PrivacyPolicyScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data } = useQuery<ConnectionRequestsInterface>(
    GET_CONNECTION_REQUEST
  );

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU_STATE);

  const [changeSideMenuState] = useMutation(TOGGLE_SIDE_MENU);

  const toggleSideMenu = () => {
    drawerData?.showSideMenu === false
      ? changeSideMenuState({
          variables: { showSideMenu: true }
        })
      : changeSideMenuState({
          variables: { showSideMenu: false }
        });
  };

  useEffect(() => {
    tagScreenName('PrivacyPolicyScreen');
  }, []);
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
            {t(`community.sideNav.policy`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableHighlight
            {...props}
            onPress={() => {
              toggleSideMenu();
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
        <Welcome>Privacy Policy Screen</Welcome>
      </Container>
    </Fragment>
  );
}
