import { Kit } from '../..';
import {
    TreasureTrade,
    TreasureTradePaginator,
    QueryTreasureTradesArgs,
    QueryTreasureTradesOrderByOrderByClause,
} from '../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../services/GraphQL';

export interface Parameters {
    id?: number[];
    nation_id?: number[];
    min_id?: number[];
    max_id?: number[];
    orderBy?: QueryTreasureTradesOrderByOrderByClause;
    first?: number;
    page?: number;
}

/**
 * Gets a list of treasure trades
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<Nation[] | EmbargoPaginator>} The nations queried or as paginated
 */
export default async function treasureTradeQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<TreasureTrade[]>;
export default async function treasureTradeQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<TreasureTradePaginator>;
export default async function treasureTradeQuery(
    this: Kit,
    params: Parameters,
    query: string,
    paginator?: boolean,
): Promise<TreasureTradePaginator | TreasureTrade[]> {
    const argsToParameters = GraphQL.generateParameters(params as QueryTreasureTradesArgs);

    const res = await GraphQL.makeCall(`
    {
      treasure_trades${argsToParameters} {
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

    if (paginator) return res.data.embargoes as TreasureTradePaginator;

    return res.data.embargoes.data as TreasureTrade[];
}
