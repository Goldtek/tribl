import Constants from 'expo-constants';
import RNMixpanel from 'react-native-mixpanel';
import {
  DEVICE_ID,
  DEVICE_OS,
  DEVICE_FULL_WIDTH,
  DEVICE_FULL_HEIGHT,
  DEVICE_MODEL,
  SYSTEM_VERSION,
  APP_VERSION,
  APPLICATION_NAME,
  DEVICE_NAME
} from '../../utils/device';

const isIosPlatform = DEVICE_OS === 'ios';

interface Props<T = any> {
  [key: string]: T;
}

export default class MixpanelAnalytics {
  appId?: string;
  model?: string;
  appName?: string;
  clientId: string;
  platform?: string;
  osVersion?: string;
  appVersion?: string;
  deviceName?: string;
  userId: string | null;
  userAgent: string | null;
  screenSize: string | null;

  constructor() {
    this.userId = null;
    this.userAgent = null;
    this.screenSize = null;
    this.clientId = DEVICE_ID;

    Constants.getWebViewUserAgentAsync().then((userAgent) => {
      this.appId = DEVICE_ID;
      this.userAgent = userAgent;
      this.appVersion = APP_VERSION;
      this.appName = APPLICATION_NAME;
      DEVICE_NAME.then((name) => (this.deviceName = name));
      this.screenSize = `${DEVICE_FULL_WIDTH}x${DEVICE_FULL_HEIGHT}`;

      if (isIosPlatform) {
        this.model = DEVICE_MODEL;
        this.platform = DEVICE_OS;
        this.osVersion = SYSTEM_VERSION;
      } else {
        this.platform = DEVICE_OS;
      }
    });
  }

  track(name: string, props: Props): void {
    RNMixpanel.trackWithProperties(name, this._pushEvent(props));
  }

  identify(userId: string): void {
    this.userId = userId;
    RNMixpanel.identify(userId);
  }

  createAlias(userId: string): void {
    this.userId = userId;
    RNMixpanel.createAlias(userId);
  }

  people_set(props: Props) {
    RNMixpanel.set(this._pushEvent(props));
  }

  people_set_once(props: Props): void {
    RNMixpanel.setOnce(this._pushEvent(props));
  }

  people_increment(name: string, props: number) {
    RNMixpanel.increment(name, props);
  }

  people_append(name: string, props: any[]): void {
    RNMixpanel.append(name, [...props]);
  }

  people_union(name: string, props: any[]): void {
    RNMixpanel.append(name, [...props]);
  }

  _pushEvent(props: Props) {
    const data = { ...props };

    data.app_id = this.appId;
    data.app_name = this.appName;
    data.client_id = this.clientId;
    data.user_agent = this.userAgent;
    data.screen_size = this.screenSize;
    data.app_version = this.appVersion;
    data.device_name = this.deviceName;

    if (this.model) data.model = this.model;

    if (this.userId) data.distinct_id = this.userId;

    if (this.platform) data.platform = this.platform;

    if (this.osVersion) data.os_version = this.osVersion;

    return data;
  }
}
