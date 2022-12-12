
import { Kit } from '../../..';
import {
  BBGame,
  BBGamePaginator,
  QueryBaseballGamesArgs,
  QueryBaseballGamesOrderByOrderByClause,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id?: number[];
  min_id?: number;
  max_id?: number;
  team_id?: number[];
  orderBy?: QueryBaseballGamesOrderByOrderByClause;
  open?: boolean;
  min_wager?: number;
  max_wager?: number;
  wager?: number[];
  first: number
  page?: number;
}

/**
 * Gets a list of baseball games
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<Nation[] | NationPaginator>} The baseball games queried or as paginated
 */
export default async function BBGameQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<BBGame[]>;
export default async function BBGameQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<BBGamePaginator>;
export default async function BBGameQuery(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<BBGamePaginator | BBGame[]> {
  const argsToParameters = GraphQL.generateParameters(params as QueryBaseballGamesArgs);

  const res = await GraphQL.makeCall(`
    {
       baseball_games${argsToParameters} {
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

  if (paginator) return res.data.nations as BBGamePaginator;

  return res.data.nations.data as BBGame[];
}
