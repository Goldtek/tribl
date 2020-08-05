import React, { Fragment } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Divider, TouchableRipple, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from '../connectionCard';
import MembersData from '../../../../../libs/members/index.json';
import hexToRGB from '../../../../../utils/hexToRGB';

import { GroupWrapper, Container } from './styles';
import { FontAwesome } from '@expo/vector-icons';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface { }

export default function ChannelScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  const _seperator = () => (
    <Divider
      style={{
        borderWidth: 1,
        borderColor: colors.DISABLED,
        marginHorizontal: RFValue(20)
      }}
    />
  );

  return (
    <Fragment>
      <TouchableRipple
        style={{
          backgroundColor: colors.WHITE,
          paddingHorizontal: RFValue(20),
          paddingBottom: RFValue(5),
          height: RFValue(60)
        }}
        rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
        onPress={() => { }}
      >
        <Fragment>
          <Container>
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
              new group
            </Text>
          </Container>
          <Divider />
        </Fragment>
      </TouchableRipple>
      <FlatList
        data={MembersData}
        contentContainerStyle={{
          flexGrow: 1
        }}
        style={{ backgroundColor: colors.WHITE, marginTop: 20 }}
        ItemSeparatorComponent={_seperator}
        showsVerticalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id}
      />
    </Fragment>
  );
}
