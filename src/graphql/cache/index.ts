import { InMemoryCache } from 'apollo-cache-inmemory';
import { USER_DEFAULT_AVATAR } from '../../constants';
import { DEVICE_DEFAULT_COUNTRY } from '../../utils/device';
import { StoreInterface } from '../types';

const cache = new InMemoryCache({ freezeResults: true });

/*
 ****************************************************************
 ******************    APOLLO CACHE FOR   ***********************
 *******************  APP STATE MANAGEMENT ***********************
 ****************************************************************
 */
export const userDetails = {
  bio: '',
  dob: '',
  email: '',
  phoneNumber: '',
  countryCode: DEVICE_DEFAULT_COUNTRY,
  firstName: '',
  lastName: '',
  citizenship: [],
  connectionCount: 0,
  communityCount: 0,
  connected: null,
  status: null,
  conversation: null,
  identity: [],
  interest: [],
  currentLocation: {
    lat: null,
    long: null,
    country: '',
    city: '',
    state: '',
    __typename: 'currentLocation'
  },
  birthPlace: {
    lat: null,
    long: null,
    country: '',
    city: '',
    state: '',
    __typename: 'birthPlace'
  },
  myConnections: [
    {
      id: '',
      avatar: '',
      lastName: '',
      firstName: '',
      phoneNumber: '',
      __typename: 'myConnections'
    }
  ],
  participantOf: [
    {
      id: '',
      name: '',
      avatar: '',
      isPrivate: null,
      isModerator: null,
      membersCount: 0,
      __typename: 'participantOf'
    }
  ],
  myChannels: [
    {
      id: '',
      name: '',
      isMember: null,
      isPrivate: null,
      community: {
        id: '',
        name: '',
        avatar: '',
        __typename: 'community'
      },
      __typename: 'myChannels'
    }
  ],
  avatar: USER_DEFAULT_AVATAR,
  __typename: 'userDetails'
};

cache.writeData<StoreInterface>({
  data: {
    //@ts-ignore
    userDetails,
    communitySearchIndex: 0,
    showMessageNotificationBadge: false,
    showSideMenu: false,
    activeSideMenu: 'drawer_community_key',
    showConnectionNotificationBadge: false
  }
});

export default cache;
