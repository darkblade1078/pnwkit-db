
import { Kit } from '../../..';
import {
  BBTeam,
  BBTeamPaginator,
  QueryBaseballTeamsArgs,
  QueryBaseballTeamsOrderByOrderByClause,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id?: number[];
  orderBy?: QueryBaseballTeamsOrderByOrderByClause;
  first: number
  page?: number;
}

/**
 * Gets a list of baseball games
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<BBTeam[] | BBTeamPaginator>} The baseball games queried or as paginated
 */
export default async function BBTeamQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<BBTeam[]>;
export default async function BBTeamQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<BBTeamPaginator>;
export default async function BBTeamQuery(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<BBTeamPaginator | BBTeam[]> {
  const argsToParameters = GraphQL.generateParameters(params as QueryBaseballTeamsArgs);

  const res = await GraphQL.makeCall(`
    {
        baseball_teams${argsToParameters} {
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

  if (paginator) return res.data.nations as BBTeamPaginator;

  return res.data.nations.data as BBTeam[];
}
