import { Kit } from '../..';
import {
  Maybe,
  Nation,
  NationPaginator,
  QueryNationsArgs,
  QueryNationsOrderByOrderByClause,
  Scalars,
} from '../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../services/GraphQL';

export enum AlliancePosition {
  Noalliance = 0,
  Applicant = 1,
  Member = 2,
  Officer = 3,
  Heir = 4,
  Leader = 5,
}

export interface Parameters {
  id?: number[];
  nation_name?: string[];
  leader_name?: string[];
  alliance_id?: number[];
  alliance_position?: number[];
  alliance_position_id?: number[];
  color?: string[];
  created_after?: Date;
  min_score?: number;
  max_score?: number;
  cities?: number[];
  min_cities?: number;
  max_cities?: number; 
  vmode?: boolean
  discord?: string[];
  discord_id?: string[];
  tax_id?: number[];
  orderBy?: QueryNationsOrderByOrderByClause
  first: number
  page?: number;
}

/**
 * Gets a list of nations
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean?} paginator Deliver the data in a paginated format
 * @returns {Promise<Nation[] | NationPaginator>} The nations queried or as paginated
 */
export default async function nationQuery(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Nation[]>;
export default async function nationQuery(this: Kit, params: Parameters, query: string, paginator: true): Promise<NationPaginator>;
export default async function nationQuery(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<NationPaginator | Nation[]> {
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

  if (paginator) return res.data.nations as NationPaginator;

  return res.data.nations.data as Nation[];
}
