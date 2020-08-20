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
      DOB: '',
      email: '',
      number: '',
      countryCode: DEVICE_DEFAULT_COUNTRY,
      firstName: '',
      lastName: '',
      citizenship: '',
      currentLocation: {
        lat: null,
        long: null,
        country: '',
        state: '',
        __typename: 'currentLocation'
      },
      birthPlace: {
        lat: null,
        long: null,
        country: '',
        state: '',
        __typename: 'birthPlace'
      },
      identities: [],
      interests: [],
      userId: '',
      avatar: 'https://bit.ly/39kcTOS',
      __typename: 'userDetails'
    }
  }
});

export default cache;
