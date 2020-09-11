import { InMemoryCache } from 'apollo-cache-inmemory';
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
    userDetails: {
      id: '',
      dob: {
        formatted: null,
        day: 0,
        month: 0,
        year: 0,
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
      connected: '',
      identity: [],
      interest: [],
      currentLocation: [
        {
          lat: null,
          long: null,
          country: '',
          state: '',
          __typename: 'currentLocation'
        }
      ],
      birthPlace: [
        {
          lat: null,
          long: null,
          country: '',
          state: '',
          __typename: 'birthPlace'
        }
      ],
      avatar:
        'https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp',
      __typename: 'userDetails'
    },
    communitySearchIndex: 0
  }
});

export default cache;
