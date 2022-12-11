import { Kit } from '../..';
import { ApiKeyDetails } from '../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../services/GraphQL';

/**
 * Gets the details of the api key
 * @param {string} query The graphql query to get info with
 * @return {Promise<ApiKeyDetails[]>}
 */
export default async function ApiKeyDetailsQuery(
    this: Kit,
    query: string,
): Promise<ApiKeyDetails[]> {
    const res = await GraphQL.makeCall(`
    {
      me {
        ${query}
      }
    }
  `, this.apiKey);

    this.setRateLimit(res.rateLimit);

    return res.data.me as ApiKeyDetails[];
}
