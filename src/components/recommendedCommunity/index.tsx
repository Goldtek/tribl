import React, { useCallback, useState, useEffect } from 'react';
import { Button, Card, Text, Title } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../config';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import {
  JOIN_COMMUNITY,
  JOIN_PRIVATE_COMMUNITY,
  LEAVE_COMMUNITY
} from '../../graphql/server/mutations';
import {
  GET_SINGLE_COMMUNITY,
  GET_COMMUNITY_MEMBERS,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY
} from '../../graphql/server/query';
import {
  CommunityInterface,
  SingleCommunityRequestInterface
} from '../../graphql/types';
import { logEvent } from '../../utils/uxcamHelper';
import Storage from '../../libs/storage';
import { crashlytics } from '../../firebase/config';
import hexToRGB from '../../utils/hexToRGB';

import { LeftCover, TitleCover } from './styles';

function RecommendedCommunity(props: CommunityInterface) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();
  const [buttonLabel, setButtonLabel] = useState(
    t(`community.recommended.join`)
  );

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState({ ...props });

  const {
    id,
    name,
    avatar,
    isMember,
    isPrivate,
    isRequested,
    membersCount
  } = community;

  const { data, refetch } = useQuery<SingleCommunityRequestInterface>(
    GET_SINGLE_COMMUNITY,
    { variables: { input: { filter: { id } } } }
  );

  useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { input: { filter: { communityId: id } } }
  });

  useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY, {
    variables: { input: { communityId: id } }
  });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [joinPrivateCommunity] = useMutation(JOIN_PRIVATE_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const handleJoin = async () => {
    logEvent('join community', { from: 'community' });
    try {
      Mixpanel.track('User Joins Tribe', {
        info: `User Joins ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
      setLoading(true);
      await joinCommunity();
      setButtonLabel(t(`community.recommended.leave`));
      Storage.setTagModal({ community: [id] });
      refetch().then(() => setLoading(false));
      setModal(true);
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleJoinPrivateTribe = async () => {
    logEvent('request to join private community', { from: 'community' });
    try {
      Mixpanel.track('User Requests To Join Tribe', {
        info: `User Request To Join ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
      setLoading(true);
      await joinPrivateCommunity();
      setButtonLabel(t(`community.tabPanel.request`));
      refetch().then(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(error);
    }
  };

  const handleLeave = async () => {
    logEvent('leave community', { from: 'community' });
    try {
      Mixpanel.track('User Leaves Tribe', {
        info: `User Leaves ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
      setLoading(true);
      await leaveCommunity();
      setButtonLabel(t(`community.recommended.join`));
      Storage.removeTagModal(id);
      refetch().then(() => setLoading(false));
      setModal(false);
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleNavigation = useCallback(() => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: props,
      showModal: modal,
      showModalCount: 1
    });
  }, [modal]);

  useEffect(() => {
    if (isMember) {
      setButtonLabel(t(`community.recommended.leave`));
    } else if (isRequested) {
      setButtonLabel(t(`community.tabPanel.request`));
    } else {
      setButtonLabel(t(`community.recommended.join`));
    }
  }, [isMember, isRequested]);

  useEffect(() => {
    if (data?.Community.data || props) {
      setCommunity({ ...community, ...props, ...data?.Community.data });
    }
  }, [props.isMember, data?.Community.data]);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: '100%',
        height: RFValue(300),
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        marginTop: 3,
        elevation: 0
      }}
    >
      <Card.Content
        style={{
          width: DEVICE_FULL_WIDTH - 30,
          height: RFValue(230),
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{ uri: avatar, priority: FastImage.priority.high }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
        <Text
          style={{
            fontSize: fonts.LARGE_SIZE - 1,
            fontFamily: fonts.WORK_SANS_BOLD,
            color: colors.WHITE,
            backgroundColor: hexToRGB(colors.BLACK, 0.2),
            position: 'absolute',
            left: 15,
            top: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 10,
            textTransform: 'capitalize'
          }}
        >
          {isPrivate ? 'Private' : 'Public'}
        </Text>
      </Card.Content>
      <Card.Content
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 0,
          marginTop: RFValue(10)
        }}
      >
        <LeftCover>
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{ uri: avatar, priority: FastImage.priority.high }}
            style={{
              width: RFValue(45),
              height: RFValue(45),
              borderRadius: 5
            }}
          />
          <TitleCover>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                lineHeight: RFValue(15)
              }}
            >
              {name}
            </Title>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.SECONDARY_TEXT,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                lineHeight: RFValue(13)
              }}
            >
              {membersCount <= 1
                ? `${membersCount} ${t(`community.tabPanel.member`)}`
                : `${membersCount} ${t(`community.tabPanel.member`)}s`}
            </Text>
            {/* <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.ONLINE
              }}
            >
              <Feather name="star" size={13} color={colors.ONLINE} /> Popular
            </Text> */}
          </TitleCover>
        </LeftCover>
        <Button
          mode="text"
          disabled={isRequested ? true : false}
          loading={loading}
          onPress={
            isMember
              ? handleLeave
              : isPrivate
              ? handleJoinPrivateTribe
              : handleJoin
          }
          labelStyle={{
            color: colors.PRIMARY,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            textAlign: 'center'
          }}
          style={{
            height: RFValue(35),
            backgroundColor: hexToRGB(colors.PRIMARY, 0.3),
            borderRadius: RFValue(5),
            justifyContent: 'center'
          }}
        >
          {buttonLabel}
        </Button>
      </Card.Content>
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
