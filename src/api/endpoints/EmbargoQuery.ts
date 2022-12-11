import { Kit } from '../..';
import {
    Embargo,
    EmbargoPaginator,
    QueryNationsArgs,
    QueryNationsOrderByOrderByClause,
} from '../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../services/GraphQL';

export interface Parameters {
    id?: number[];
    nation_id?: number[];
    min_id?: number[];
    max_id?: number[];
    orderBy?: QueryNationsOrderByOrderByClause;
    first?: number;
    page?: number;
}

/**
 * Gets a list of nations
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<Nation[] | EmbargoPaginator>} The nations queried or as paginated
 */
export default async function embargoQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Embargo[]>;
export default async function embargoQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<EmbargoPaginator>;
export default async function embargoQuery(
    this: Kit,
    params: Parameters,
    query: string,
    paginator?: boolean,
): Promise<EmbargoPaginator | Embargo[]> {
    const argsToParameters = GraphQL.generateParameters(params as QueryNationsArgs);

    const res = await GraphQL.makeCall(`
    {
      nations${argsToParameters} {
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

    if (paginator) return res.data.embargoes as EmbargoPaginator;

    return res.data.embargoes.data as Embargo[];
}
