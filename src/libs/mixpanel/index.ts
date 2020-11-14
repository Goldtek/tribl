import Constants from 'expo-constants';
import { Buffer } from 'buffer';
import * as Sentry from '@sentry/react-native';
import {
  DEVICE_ID,
  DEVICE_OS,
  DEVICE_FULL_WIDTH,
  DEVICE_FULL_HEIGHT
} from '../../utils/device';

const MIXPANEL_API_URL = 'http://api.mixpanel.com';
const isIosPlatform = DEVICE_OS === 'ios';

interface Props<T = any> {
  [key: string]: T;
}

export default class MixpanelAnalytics {
  ready: boolean;
  queue: any[];
  token: string;
  appId?: string;
  appName?: string;
  userId: string | null;
  clientId: string;
  appVersion?: string;
  screenSize: string | null;
  deviceName?: string;
  userAgent: string | null;
  platform?: string;
  model?: string;
  osVersion?: string;

  constructor(token: string) {
    this.ready = false;
    this.queue = [];
    this.token = token;
    this.userId = null;
    this.screenSize = null;
    this.userAgent = null;
    this.clientId = DEVICE_ID;
    this.identify(this.clientId);

    Constants.getWebViewUserAgentAsync().then((userAgent) => {
      this.userAgent = userAgent;
      this.appName = Constants.manifest.name;
      this.appId = Constants.manifest.slug;
      this.appVersion = Constants.manifest.version;
      this.screenSize = `${DEVICE_FULL_WIDTH}x${DEVICE_FULL_HEIGHT}`;
      this.deviceName = Constants.deviceName;

      if (isIosPlatform) {
        this.platform = Constants.platform?.ios?.platform;
        this.model = Constants.platform?.ios?.model;
        this.osVersion = Constants.platform?.ios?.systemVersion;
      } else {
        this.platform = 'android';
      }

      this.ready = true;
      this._flush();
    });
  }

  track(name: string, props: Props): void {
    this.queue.push({ name, props });
    this._flush();
  }

  identify(userId: string): void {
    this.userId = userId;
  }

  reset(): void {
    this.identify(this.clientId);
  }

  people_set(props: any) {
    this._people('set', props);
  }

  people_set_once(props: Props): void {
    this._people('set_once', props);
  }

  people_unset(props: string[]): void {
    this._people('unset', props);
  }

  people_increment(props: any) {
    this._people('add', props);
  }

  people_append(props: Props<number>): void {
    this._people('append', props);
  }

  people_union(props: Props<string[]>): void {
    this._people('union', props);
  }

  people_delete_user(): void {
    this._people('delete', '');
  }

  // ===========================================================================================

  _flush() {
    if (this.ready) {
      while (this.queue.length) {
        const event = this.queue.pop();
        this._pushEvent(event).then(() => (event.sent = true));
      }
    }
  }

  _people(operation: string, props: any) {
    if (this.userId) {
      const data = { $token: this.token, $distinct_id: this.userId } as {
        [key: string]: string;
      };

      data[`$${operation}`] = props;
      this._pushProfile(data);
    }
  }

  _pushEvent(event: any) {
    let data: any = { event: event.name, properties: event.props };

    if (this.userId) {
      data.properties.distinct_id = this.userId;
    }

    data.properties.token = this.token;
    data.properties.user_agent = this.userAgent;
    data.properties.app_name = this.appName;
    data.properties.app_id = this.appId;
    data.properties.app_version = this.appVersion;
    data.properties.screen_size = this.screenSize;
    data.properties.client_id = this.clientId;
    data.properties.device_name = this.deviceName;

    if (this.platform) {
      data.properties.platform = this.platform;
    }

    if (this.model) {
      data.properties.model = this.model;
    }

    if (this.osVersion) {
      data.properties.os_version = this.osVersion;
    }

    data = Buffer.from(JSON.stringify(data)).toString('base64');

    return fetch(`${MIXPANEL_API_URL}/track/?data=${data}`);
  }

  _pushProfile(data: any) {
    data = Buffer.from(JSON.stringify(data)).toString('base64');
    return fetch(`${MIXPANEL_API_URL}/engage/?data=${data}`)
      .then(() => {})
      .catch((error) => Sentry.captureException(error));
  }
}
