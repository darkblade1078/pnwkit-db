import { Kit } from '../../../build/src';
import { subscriptionModel, subscriptionEvent } from '../../interfaces/PoliticsAndWarGraphQL';
import Pusher, { Channel } from "pusher-js";

/**
 * Gets a subscription
 * @param {Parameters} params Subscription parameters to customize your results
 * @returns {Promise<Channel>} The subscription channel itself
 */

export default async function subscribe(this: Kit, model: subscriptionModel, event: subscriptionEvent, callBackFunction: Function, filters?: string): Promise<Channel> {

    const channelName = JSON.parse(await (await fetch(`https://api.politicsandwar.com/subscriptions/v1/subscribe/${model}/${event}?api_key=${this.apiKey}&${filters}`, {
        method: 'GET',
    })).text()).channel;

    const pusher = new Pusher("a22734a47847a64386c8", {
        cluster: "us2",
        wsHost: "socket.politicsandwar.com",
        disableStats: true,
        authEndpoint: "https://api.politicsandwar.com/subscriptions/v1/auth",
    });

    const channel = pusher.subscribe(channelName);
    channel.bind(`BULK_${model.toUpperCase()}${event.toUpperCase()}`, callBackFunction);

    return channel;
}
