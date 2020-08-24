import React, { Fragment, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native';
import { Divider, TouchableRipple, Button, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import MemberCard from './widgets/connectionCard';
import AlgoliaSearch from '../../../components/algoliaSearch';
import AlgoliaList from '../../../components/algoliaInboxList';
import hexToRGB from '../../../utils/hexToRGB';
import MembersData from '../../../libs/members/index.json';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  GroupWrapper,
  FilterContainer,
  GroupContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [filter, setFilter] = useState(
    t(`community.chat.connection`) as string
  );

  const _separator = () =>
    useMemo(
      () => (
        <Divider
          style={{
            height: 1.5,
            backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
            marginHorizontal: RFValue(20)
          }}
        />
      ),
      []
    );

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: RFValue(5),
        backgroundColor: colors.WHITE
      }}
    >
      <Container>
        <AlgoliaSearch indexName="tribl_passport_staging">
          <AlgoliaList />
        </AlgoliaSearch>

        <FilterContainer>
          <Button
            mode="contained"
            onPress={() => setFilter(t(`community.chat.connection`))}
            labelStyle={{
              color:
                filter === t(`community.chat.connection`)
                  ? colors.WHITE
                  : colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize'
            }}
            contentStyle={{
              paddingVertical: 8,
              paddingHorizontal: 5,
              backgroundColor:
                filter === t(`community.chat.connection`)
                  ? colors.PRIMARY
                  : colors.WHITE
            }}
            style={{ borderRadius: 4 }}
          >
            {t(`community.chat.connection`)}
          </Button>
          <Button
            mode="contained"
            onPress={() => setFilter(t(`community.chat.nearby`))}
            labelStyle={{
              color:
                filter === t(`community.chat.nearby`)
                  ? colors.WHITE
                  : colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize'
            }}
            contentStyle={{
              paddingVertical: 8,
              paddingHorizontal: 5,
              backgroundColor:
                filter === t(`community.chat.nearby`)
                  ? colors.PRIMARY
                  : colors.WHITE
            }}
            style={{ marginHorizontal: 20, borderRadius: 4 }}
          >
            {t(`community.chat.nearby`)}
          </Button>
        </FilterContainer>

        <TouchableRipple
          style={{
            backgroundColor: colors.WHITE,
            paddingHorizontal: RFValue(20),
            paddingBottom: RFValue(5)
          }}
          rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
          onPress={() => {}}
        >
          <Fragment>
            <GroupContainer>
              <GroupWrapper>
                <FontAwesome name="group" size={30} color={colors.PRIMARY} />
              </GroupWrapper>
              <Text
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  paddingLeft: RFValue(15),
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.chat.new`)}
              </Text>
            </GroupContainer>
            <Divider />
          </Fragment>
        </TouchableRipple>

        <FlatList
          data={MembersData}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={_separator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          style={{ backgroundColor: colors.WHITE, paddingTop: 10 }}
        />
      </Container>
    </SafeAreaView>
  );
}
