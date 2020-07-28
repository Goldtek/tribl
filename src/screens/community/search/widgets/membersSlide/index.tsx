import React, { Fragment } from 'react';
import { NavigationInterface } from '../../../../types';
import { Title, Paragraph, Button, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity, ScrollView } from 'react-native';
import RecommendedMembers from '../../../../../components/recommendedUser';
import MembersData from '../../../../../libs/recommendedUsers/index.json';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderContainer,
  TitleWrapper,
  RecommendedList,
  RecommendedListHeader
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
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
              most active members
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={() => {}}
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
                  view all
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
              members nearby
            </Title>
            <TouchableRipple
              rippleColor={colors.PRIMARY}
              onPress={() => {}}
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
                  view all
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
      </Container>
    </ScrollView>
  );
}
