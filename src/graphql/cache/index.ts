import { InMemoryCache } from 'apollo-cache-inmemory';
import { DEVICE_DEFAULT_COUNTRY } from '../../utils/device';

const cache = new InMemoryCache({ freezeResults: true });

/*
 ****************************************************************
 ******************    APOLLO CACHE FOR   ***********************
 *******************  APP STATE MANAGEMENT ***********************
 ****************************************************************
 */

cache.writeData({
  data: { countryCode: DEVICE_DEFAULT_COUNTRY }
});

export default cache;
