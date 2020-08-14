import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/community';
import { Feather } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native';
import hexToRGB from '../../utils/hexToRGB';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import AlgoliaSearch from '../../components/algoliaSearch';
import AlgoliaList from '../../components/algoliaInboxList';
import AlgoliaCommunityList from '../../components/algoliaCommunityList ';

const CommunityStack = createStackNavigator();

interface CommunityNavigatorProps extends NavigationInterface {}

export default function CommunityNavigator(props: CommunityNavigatorProps) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <CommunityStack.Navigator
      initialRouteName="CommunityScreen"
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(90) } }}
    >
      <CommunityStack.Screen
        name="CommunityScreen"
        component={Screens.HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(50),
                height: RFValue(50),
                right: Platform.select({ android: RFValue(20) }),
                resizeMode: 'contain'
              }}
            />
          ),
          headerLeft: (props) => (
            <TouchableHighlight
              {...props}
              onPress={navigation.toggleDrawer}
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
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: { marginRight: 10 }
        }}
      />

      <CommunityStack.Screen
        name="CommunitySearchScreen"
        component={Screens.SearchScreen}
        options={{
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRight: () => (
            <AlgoliaSearch indexName="tribl_community_develop">
              <AlgoliaCommunityList />
            </AlgoliaSearch>
          ),
          headerRightContainerStyle: {
            width: '100%'
          }
        }}
      />

      <CommunityStack.Screen
        name="CommunityDetailScreen"
        component={Screens.CommunityDetailScreen}
        options={({ route }) => ({
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <CommunityStack.Screen
        name="MemberDetailScreen"
        component={Screens.MemberDetailScreen}
        options={({ route }) => ({
          //@ts-ignore
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD,
            textTransform: 'capitalize'
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { marginRight: 10 },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />
    </CommunityStack.Navigator>
  );
}
