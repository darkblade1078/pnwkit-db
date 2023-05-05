
import { Kit } from '../../..';
import {
  BBPlayer,
  BBPlayerPaginator,
  QueryBaseballPlayersArgs,
  QueryBaseballPlayersOrderByOrderByClause,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id?: number[];
  team_id?: number[];
  orderBy?: QueryBaseballPlayersOrderByOrderByClause;
  first: number
  page?: number;
}

/**
 * Gets a list of baseball games
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<BBPlayer[] | BBPlayerPaginator>} The baseball games queried or as paginated
 */
export default async function BBPlayerQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<BBPlayer[]>;
export default async function BBPlayerQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<BBPlayerPaginator>;
export default async function BBPlayerQuery(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<BBPlayerPaginator | BBPlayer[]> {
  const argsToParameters = GraphQL.generateParameters(params as QueryBaseballPlayersArgs);

  const res = await GraphQL.makeCall(`
    {
       baseball_players${argsToParameters} {
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

  if (paginator) return res.data.nations as BBPlayerPaginator;

  return res.data.nations.data as BBPlayer[];
}
