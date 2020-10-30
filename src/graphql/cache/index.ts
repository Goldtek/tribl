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

cache.writeData<StoreInterface>({
  data: {
    //@ts-ignore
    userDetails: {
      bio: '',
      dob: {
        formatted: null,
        day: 0,
        month: 0,
        year: 0,
        hour: 0,
        minute: 0,
        second: 0,
        timeZoneId: null,
        nanosecond: null,
        millisecond: null,
        timeZoneOffsetSeconds: null,
        __typename: 'dateOfBirth'
      },
      email: '',
      phoneNumber: '',
      countryCode: DEVICE_DEFAULT_COUNTRY,
      firstName: '',
      lastName: '',
      citizenShip: '',
      connectionCount: 0,
      communityCount: 0,
      connected: null,
      status: null,
      conversation: null,
      identity: [],
      interest: [],
      currentLocation: [
        {
          lat: null,
          long: null,
          country: '',
          city: '',
          state: '',
          __typename: 'currentLocation'
        }
      ],
      birthPlace: [
        {
          lat: null,
          long: null,
          country: '',
          city: '',
          state: '',
          __typename: 'birthPlace'
        }
      ],
      avatar: USER_DEFAULT_AVATAR,
      __typename: 'userDetails'
    },
    communitySearchIndex: 0,
    showMessageNotificationBadge: false,
    showConnectionNotificationBadge: false
  }
});

export default cache;
