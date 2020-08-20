import React, { Fragment, useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import RecommendedMembers from '../../../../../components/recommendedUser';
import MembersData from '../../../../../libs/recommendedUsers/index.json';
import { GET_NEARBY_MEMBERS } from '../../../../../graphql/server/query';
import NearbyModal from '../../../../../components/nearbyMembers';
import ActiveModal from '../../../../../components/activeMembers';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, RecommendedList, RecommendedListHeader } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isVisible, setIsVisible] = useState(false);

  const [visible, setVisible] = useState(false);

  const showNearbyModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);
      return true;
    },
    []
  );

  const showActiveModal = useCallback(
    (visible: boolean) => () => {
      setVisible(visible);
      return true;
    },
    []
  );

  const { data: nearbyData } = useQuery(GET_NEARBY_MEMBERS);

  const NearbyMembers = nearbyData?.nearbyMembers;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      style={{ flexGrow: 1 }}
    >
      <Container>
        <RecommendedList>
          <RecommendedListHeader>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: 20,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {t(`community.tabPanel.active`)}
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={showActiveModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 15,
                padding: 5
              }}
            >
              <Fragment>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize',
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 5
                  }}
                >
                  {t(`community.tabPanel.view`)}
                </Paragraph>
                <Feather
                  name="arrow-right"
                  size={RFValue(fonts.LARGE_SIZE)}
                  color={colors.PRIMARY_TEXT}
                />
              </Fragment>
            </TouchableRipple>
          </RecommendedListHeader>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
          >
            {MembersData.map((member, index) => (
              <RecommendedMembers
                key={index}
                {...member}
                index={index}
                lastChild={MembersData.length - 1}
              />
            ))}
          </ScrollView>
        </RecommendedList>
        <RecommendedList>
          <RecommendedListHeader>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                lineHeight: 20,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {t(`community.tabPanel.nearby`)}
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={showNearbyModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 15,
                padding: 5
              }}
            >
              <Fragment>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize',
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 5
                  }}
                >
                  {t(`community.tabPanel.view`)}
                </Paragraph>
                <Feather
                  name="arrow-right"
                  size={RFValue(fonts.LARGE_SIZE)}
                  color={colors.PRIMARY_TEXT}
                />
              </Fragment>
            </TouchableRipple>
          </RecommendedListHeader>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
          >
            {NearbyMembers?.map((member: any, index: number) => (
              <RecommendedMembers
                key={member.id}
                {...member}
                index={index}
                lastChild={NearbyMembers.length - 1}
              />
            ))}
          </ScrollView>
        </RecommendedList>
      </Container>
      <NearbyModal
        closeNearbyModal={showNearbyModal(false)}
        isVisible={isVisible}
        //@ts-ignore
        navigation={navigation}
      />
      <ActiveModal
        closeActiveModal={showActiveModal(false)}
        isVisible={visible}
        //@ts-ignore
        navigation={navigation}
      />
    </ScrollView>
  );
}
