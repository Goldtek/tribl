import React, { useState, Fragment, useEffect } from 'react';
import { Title, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { Octicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ADD_COMMUNITY_SEARCH_INDEX } from '../../../graphql/cache/mutations';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import communityTab from './widgets/communityTab';
import { useThemeContext } from '../../../theme';
import membersTab from './widgets/membersTab';
import { useNavigation } from '@react-navigation/native';
import ENVIRONMENT_VARIABLES from '../../../config';
import { tagScreenName } from '../../../utils/uxcamHelper';

import { Container, SearchInput } from './styles';
// DEFINE SCREEN PROP TYPES
interface ScreenProp {
  route: { params: { index: number } };
}

export default function SearchScreen(props: ScreenProp) {
  const {
    params: { index }
  } = props.route;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [tabIndex, setTabIndex] = useState(index);
  const [changeCommunitySearchIndex] = useMutation(ADD_COMMUNITY_SEARCH_INDEX);

  useEffect(() => {
    tagScreenName('ViewAllScreen');
  }, []);

  const [routes] = useState([
    { key: 'membersTab', title: `${t(`community.tabPanel.member`)}` },
    { key: 'communityTab', title: `${t(`community.tabPanel.community`)}` }
  ]);

  const renderScene = SceneMap({ membersTab, communityTab });

  const handleIndexChange = (index: number) => {
    setTabIndex(index);
    changeCommunitySearchIndex({ variables: { communitySearchIndex: index } });
  };

  const indexName = [
    ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME,
    ENVIRONMENT_VARIABLES.ALGOLIA_COMMUNITY_INDEX_NAME
  ];

  const showSearchScreen = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'CommunityAlgoliaScreen',
      params: { indexName: indexName[tabIndex] }
    });
    return true;
  };

  const renderLabel = ({
    route,
    focused
  }: {
    route: { title: string };
    focused: boolean;
  }) => (
    <Title
      style={{
        fontFamily: focused
          ? fonts.WORK_SANS_SEMI_BOLD
          : fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE + 1),
        color: focused ? colors.PRIMARY : colors.PRIMARY_TEXT,
        textTransform: 'capitalize',
        marginTop: 0,
        marginBottom: 0,
        width: '105%'
      }}
    >
      {route.title}
    </Title>
  );

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: colors.PRIMARY, height: RFValue(4) }}
        renderLabel={renderLabel}
        style={{
          backgroundColor: colors.GREY,
          shadowColor: colors.TRANSPARENT,
          elevation: 0,
          marginBottom: 10
        }}
      />
    );
  };

  return (
    <Fragment>
      <Container>
        <Container>
          <SearchInput onStartShouldSetResponder={showSearchScreen}>
            <Octicons name="search" color={colors.PRIMARY_TEXT} size={20} />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                paddingHorizontal: RFValue(18)
              }}
            >
              {t(`community.chat.search`)}
            </Text>
          </SearchInput>
        </Container>
      </Container>
      <TabView
        lazy
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        navigationState={{ index: tabIndex, routes }}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        sceneContainerStyle={{
          paddingTop: RFValue(10),
          backgroundColor: colors.GREY
        }}
        style={{
          paddingTop: RFValue(10),
          backgroundColor: colors.GREY
        }}
      />
    </Fragment>
  );
}
