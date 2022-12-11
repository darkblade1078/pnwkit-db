import { Kit } from '../..';
import {
    Treaty,
    TreatyPaginator,
    QueryTreatiesArgs,
    QueryTreatiesOrderByOrderByClause,
} from '../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../services/GraphQL';

export interface Parameters {
    id?: number[];
    orderBy?: QueryTreatiesOrderByOrderByClause;
    first?: number;
    page?: number;
}

/**
 * Gets a list of treaties
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<Nation[] | EmbargoPaginator>} The nations queried or as paginated
 */
export default async function treatyQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Treaty[]>;
export default async function treatyQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<TreatyPaginator>;
export default async function treatyQuery(
    this: Kit,
    params: Parameters,
    query: string,
    paginator?: boolean,
): Promise<TreatyPaginator | Treaty[]> {
    const argsToParameters = GraphQL.generateParameters(params as QueryTreatiesArgs);

    const res = await GraphQL.makeCall(`
    {
      treaties${argsToParameters} {
        ${(paginator) ?
            `
          paginatorInfo {
            count,
            currentPage,
            firstItem,
            hasMorePages,
            lastItem,
            lastPage,
            perPage,
            total
          },
          `: ''
        }
        data {
          ${query}
        }
      }
    }
  `, this.apiKey);

    this.setRateLimit(res.rateLimit);

    if (paginator) return res.data.embargoes as TreatyPaginator;

    return res.data.treaties.data as Treaty[];
}
