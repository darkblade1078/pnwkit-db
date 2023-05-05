import PnwKitAPI from './api';
import memoize from 'memoizee';
import { RateLimitI } from './interfaces/GraphQLService';

/**
 * The main application class
 */
export class Kit extends PnwKitAPI {
  [key: string]: any;

  apiKey = '';
  botKey = '';
  botKeyApiKey = '';

  private rateLimitData = {
    resetAfterSeconds: 0,
    limit: 0,
    remaining: 0,
    reset: 0,
  };

  /**
   * Set the pnwkit instance's key.
   * @param key
   */
  setKey(key: string): void {
    this.apiKey = key;
  }

  /**
  * Set the x-pnwkit instance's key.
  * @param botKey
  * @param botKeyApiKey
  */
  setBotKeys(botKey: string, botKeyApiKey: string): void {
    this.botKey = botKey;
    this.botKeyApiKey = botKeyApiKey;
  }


  get rateLimit(): RateLimitI {
    return new Proxy(this.rateLimitData, {
      set: () => {
        return false;
      },
    });
  }

  /**
   * Do not call this function, this is internal.
   * @param value
   */
  setRateLimit(value: RateLimitI): void {
    this.rateLimitData = value;
  }

  /**
   * Lets you cache results of a query call
   *
   * It returns a cached version of the function that accepts the same arguments but caches it for a certain period of time
   * @param {(...args: any[]) => any} queryFunc The query function you want to cache
   * @param {number} maxAgeMinutes The max number of minutes to cache it for
   *
   * @return {Function} returns a cached version of the function
   */
  cached(queryFunc: (...args: any[]) => any, maxAgeMinutes: number) {
    return memoize(queryFunc.bind(this), { maxAge: maxAgeMinutes * 60 * 1000, promise: true, primitive: true });
  }
}

const kit = new Kit();

for (const [key] of Object.entries(kit)) {
  exports[key] = kit[key];
}

exports.setKey = kit.setKey;
exports.set_bot_key = kit.setBotKeys;
exports.cached = kit.cached;
exports.setRateLimit = kit.setRateLimit;

export default kit;
