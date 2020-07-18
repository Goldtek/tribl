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
      locality: '',
      identity: [],
      interest: [],
      userId: '',
      __typename: 'userDetails'
    }
  }
});

export default cache;
