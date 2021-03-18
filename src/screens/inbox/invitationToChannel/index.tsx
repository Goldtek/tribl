import React, { useState, useEffect, Fragment } from 'react';
import { Title, Text, Button, Divider } from 'react-native-paper';
import { Image, Keyboard, TouchableHighlight } from 'react-native';
//@ts-ignore
import AutoTags from 'react-native-tag-autocomplete';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';
import { NavigationInterface } from '../../types';
import {
  MyConnectionsInterface,
  PassportInterface
} from '../../../graphql/types';
import { GET_MY_CONNECTIONS } from '../../../graphql/server/query';
import { PAGINATION_DEFAULT } from '../../../constants';
import { useQuery, useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../../../components/gradientButton';
import { INVITE_TO_CHANNEL } from '../../../graphql/server/mutations';
import { logEvent } from '../../../utils/uxcamHelper';
import { Mixpanel } from '../../../config';
import { crashlytics } from '../../../firebase/config';
import { Toast } from '../../../components/rootToaster';

import { Container, TagCover, ButtonCover, AutoTagCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface InviteFriendsScreenProp extends NavigationInterface {}

export default function InviteFriendsToTribe(props: InviteFriendsScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const channelId = props.route.params?.channelId;
  const [state, setState] = useState<{
    suggestions: PassportInterface[];
    tagsSelected: PassportInterface[];
    query: string;
    receipientIds: string[];
  }>({
    suggestions: [],
    tagsSelected: [],
    query: '',
    receipientIds: []
  });

  const { data } = useQuery<MyConnectionsInterface>(GET_MY_CONNECTIONS, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  const myConnection = data?.myConnections?.data;

  const filterConnections = myConnection?.slice().sort(function (a, b) {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const [inviteToChannel, { loading }] = useMutation(INVITE_TO_CHANNEL, {
    variables: {
      payload: { channelId: channelId, recipientIds: state.receipientIds }
    }
  });

  const handleInputError = (error: string) => {
    Toast.show(t(`community.createTribe.${error}`));
  };

  const sendChannelInvite = async () => {
    if (state.tagsSelected?.length < 1) {
      return handleInputError('inviteError');
    }
    logEvent('send channel invite', { from: 'channel' });
    try {
      Mixpanel.track('Sendx tribe invites', {
        info: `Send tribe invite`,
        'Activity Screen': 'Tribe invitation screen'
      });
      await inviteToChannel();
      setState({
        ...state,
        tagsSelected: []
      });
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  useEffect(() => {
    if (filterConnections?.length) {
      setState({
        ...state,
        suggestions: filterConnections
      });
    }
  }, []);

  const _filterData = (query: string) => {
    if (!query || query.trim() == '' || !state.suggestions) {
      return;
    }

    let suggestions = state.suggestions;
    let queryResult: PassportInterface[] = [];

    query = query.toUpperCase();
    suggestions.forEach((i) => {
      if (
        i.firstName.toUpperCase().includes(query) ||
        i.lastName.toUpperCase().includes(query)
      ) {
        queryResult.push(i);
      }
    });
    return queryResult;
  };

  const handleDelete = (index: any) => {
    let tagsSelected = state.tagsSelected;
    tagsSelected.splice(index, 1);
    let receipientIds = state.receipientIds;
    receipientIds.splice(index, 1);
    setState({ ...state, tagsSelected, receipientIds });
  };

  const handleAddition = (suggestion: PassportInterface) => {
    setState({
      ...state,
      tagsSelected: state.tagsSelected.concat([suggestion]),
      receipientIds: state.receipientIds.concat([suggestion?.id])
    });
  };

  const _renderTags = () => {
    return (
      <TagCover>
        {state.tagsSelected.map((item, i) => {
          return (
            <TouchableHighlight
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: colors.INACTIVE,
                paddingVertical: RFValue(4),
                paddingHorizontal: RFValue(10),
                marginHorizontal: RFValue(10),
                borderRadius: 4
              }}
              onPress={() => handleDelete(i)}
            >
              <Fragment>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: item.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(25),
                    height: RFValue(25),
                    borderRadius: RFValue(50),
                    marginRight: RFValue(7)
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.WORK_SANS_MEDIUM,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'capitalize'
                  }}
                >
                  {`${item.firstName} ${item.lastName}`}
                </Text>
                <Feather
                  name="x"
                  style={{
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    color: colors.PRIMARY_TEXT,
                    marginLeft: RFValue(10)
                  }}
                />
              </Fragment>
            </TouchableHighlight>
          );
        })}
      </TagCover>
    );
  };

  return (
    <Container>
      <Image
        source={require('../../../../assets/images/icon.png')}
        style={{
          resizeMode: 'contain',
          width: RFValue(80),
          height: RFValue(80),
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: RFValue(15)
        }}
      />
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textAlign: 'center',
          marginTop: 20
        }}
      >
        {t(`community.invitation.channelTitle`)}
      </Title>
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textAlign: 'center'
        }}
      >
        {t(`community.invitation.text`)}
      </Text>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.LARGE_SIZE - 2),
          color: colors.PRIMARY_TEXT,
          marginTop: RFValue(40)
        }}
      >
        {t(`community.invitation.label`)}
      </Title>
      <KeyboardAwareScrollView
        style={{ flexGrow: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between'
        }}
      >
        <AutoTagCover>
          <AutoTags
            onBur={Keyboard.dismiss}
            suggestions={state.suggestions}
            tagsSelected={state.tagsSelected}
            handleAddition={handleAddition}
            handleDelete={handleDelete}
            blurOnSubmit={'true'}
            placeholder={t(`community.invitation.placeholder`)}
            autoFocus={false}
            tagStyles={{
              backgroundColor: colors.WHITE
            }}
            style={{
              backgroundColor: colors.WHITE,
              width: '100%',
              margin: 0
            }}
            inputContainerStyle={{
              backgroundColor: colors.WHITE,
              margin: 0,
              padding: RFValue(10)
            }}
            containerStyle={{
              backgroundColor: colors.WHITE,
              width: '100%'
            }}
            renderTags={_renderTags}
            filterData={_filterData}
            renderItem={({ item, i }: any) => (
              <Fragment>
                <TouchableHighlight
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    marginBottom: 5,
                    backgroundColor: colors.TRANSPARENT,
                    paddingVertical: RFValue(4),
                    paddingHorizontal: RFValue(10),
                    borderRadius: 4
                  }}
                  onPress={() => handleAddition(item)}
                >
                  <Fragment>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={{
                        uri: item.avatar,
                        priority: FastImage.priority.high
                      }}
                      style={{
                        width: RFValue(25),
                        height: RFValue(25),
                        borderRadius: RFValue(50),
                        marginRight: RFValue(7)
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.WORK_SANS_MEDIUM,
                        fontSize: RFValue(fonts.LARGE_SIZE - 2),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize'
                      }}
                    >
                      {`${item.firstName} ${item.lastName}`}
                    </Text>
                  </Fragment>
                </TouchableHighlight>
                <Divider
                  style={{
                    height: 1.5,
                    backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
                  }}
                />
              </Fragment>
            )}
          />
        </AutoTagCover>
      </KeyboardAwareScrollView>
      <ButtonCover>
        <GradientButton
          onPress={sendChannelInvite}
          loading={loading}
          style={{ height: 50 }}
          gradientContainerstyle={{ height: 50 }}
          contentStyle={{ height: 50 }}
        >
          {t(`community.invitation.invite`)}
        </GradientButton>
        <Button
          labelStyle={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            textTransform: 'capitalize'
          }}
          onPress={() => navigation.goBack()}
        >
          {t(`community.invitation.cancel`)}
        </Button>
      </ButtonCover>
    </Container>
  );
}
