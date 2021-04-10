import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Title, Text, Button, Searchbar } from 'react-native-paper';
import { Image, TouchableHighlight } from 'react-native';
import {
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import {
  MyConnectionsInterface,
  PassportInterface,
  AllMembersRequestInterface
} from '../../../graphql/types';
import {
  GET_MY_CONNECTIONS,
  GET_ALL_MEMBERS
} from '../../../graphql/server/query';
import { PAGINATION_DEFAULT } from '../../../constants';
import { useQuery, useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../../../components/gradientButton';
import { INVITE_TO_CHANNEL } from '../../../graphql/server/mutations';
import { logEvent } from '../../../utils/uxcamHelper';
import ENVIRONMENT_VARIABLES, { Mixpanel } from '../../../config';
import { crashlytics } from '../../../firebase/config';
import { Toast } from '../../../components/rootToaster';
import AlgoliaList from '../../../components/inviteAlgoliaList';
import { searchClient } from '../../../config';

import { Container, TagCover, ButtonCover } from './styles';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';

// DEFINE SCREEN PROP TYPES
interface InviteFriendsScreenProp extends NavigationInterface {}

export default function InviteFriendsToTribe(props: InviteFriendsScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;
  const { navigation } = props;
  const channelId = props.route.params?.channelId;
  const [state, setState] = useState<{
    tagsSelected: PassportInterface[];
    receipientIds: string[];
    search: {};
  }>({
    tagsSelected: [],
    receipientIds: [],
    search: {}
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
      Mixpanel.track('Send Channel Invites', {
        info: `Invite friends to channel`,
        'Activity Screen': 'Tribe invitation screen'
      });
      await inviteToChannel();
      setState({
        ...state,
        tagsSelected: []
      });
      navigation.goBack();
    } catch (error) {
      crashlytics.recordError(error);
    }
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
        {state.tagsSelected.map((item) => {
          return (
            <TouchableHighlight
              key={item?.id}
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
              onPress={() => handleDelete(item)}
            >
              <Fragment>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: item?.avatar,
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
                  {`${item?.firstName} ${item?.lastName}`}
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

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      autoFocus
      value={currentRefinement}
      onChangeText={(value) => refine(value)}
      placeholder={t(`community.invitation.placeholder`)}
      style={{
        height: RFValue(40),
        width: '100%',
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        backgroundColor: colors.WHITE,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
      iconColor={colors.PRIMARY_TEXT}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), [
    indexName
  ]);

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        <Fragment>
          <InstantSearch
            indexName={indexName}
            searchState={state.search}
            searchClient={searchClient}
            onSearchStateChange={onSearchStateChange}
          >
            {state?.tagsSelected?.length ? <_renderTags /> : null}
            <Configure hitsPerPage={PAGINATION_DEFAULT} distinct />
            <AlgoliaSearchBox />
            {
              //@ts-ignore
              state?.search?.query?.length ? (
                <AlgoliaList handleAddition={handleAddition} />
              ) : null
            }
          </InstantSearch>
        </Fragment>

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
      </KeyboardAwareScrollView>
    </Container>
  );
}
