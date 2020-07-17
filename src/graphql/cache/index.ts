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
      number: '',
      countryCode: DEVICE_DEFAULT_COUNTRY,
      firstName: '',
      lastName: '',
      DOB: '',
      citizenship: '',
      locality: '',
      identity: [],
      interest: []
    }
  }
});

export default cache;
