import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import {
  Divider,
  Text,
  TouchableRipple,
  ActivityIndicator,
  Title
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { HeaderActionText } from '../../styles';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderAction,
  HeaderContainer,
  HeaderTitle,
  SelectedMemberContainer,
  SelectedMemberWrapper,
  InputContainer,
  SubjectInput
} from './styles';
import { FlatList } from 'react-native';
import hexToRGB from '../../../../../utils/hexToRGB';
import {
  PAGINATION_DEFAULT,
  USER_DEFAULT_AVATAR
} from '../../../../../constants';
import { PassportInterface } from '../../../../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreateGroup(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const { navigation, route } = props;
  const { participants } = route.params;
  const [subject, setSubject] = useState('');

  const selectedItem: PassportInterface[] = Object.values(participants);

  const _renderSelectedItem = ({ item }: { item: PassportInterface }) => (
    <SelectedMemberWrapper>
      <SelectedMemberContainer>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: item.avatar || USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: 4
          }}
        />
        <Title
          numberOfLines={1}
          style={{
            color: colors.BLACK,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(10)
          }}
        >
          {item.firstName} {item.lastName} {item.lastName}
        </Title>
      </SelectedMemberContainer>
    </SelectedMemberWrapper>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RFValue(40 / 2)
            }}
          >
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
          <HeaderTitle>New Group</HeaderTitle>
          <HeaderAction>
            <HeaderActionText>Done</HeaderActionText>
          </HeaderAction>
        </HeaderContainer>

        <InputContainer>
          <SubjectInput
            placeholder="Type group Subject here..."
            value={subject}
            onChangeText={(text) => setSubject(text)}
          />
        </InputContainer>

        <FlatList
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flexGrow: 1,
            paddingBottom: 20,
            paddingVertical: RFValue(20),
            paddingHorizontal: RFValue(20)
          }}
          data={selectedItem}
          numColumns={6}
          bounces={false}
          renderItem={_renderSelectedItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <Text>Participants</Text>}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 1.5,
                backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
                marginHorizontal: RFValue(20)
              }}
            />
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                margin: RFValue(20),
                textAlign: 'center'
              }}
            >
              There are no members at this time
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </SafeAreaView>
  );
}
