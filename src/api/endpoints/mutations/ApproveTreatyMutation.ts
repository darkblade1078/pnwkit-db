import { Kit } from '../../..';
import {
  Treaty,
  ApproveTreatyPaginator,
  MutationApproveTreatyArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id: string;
}

/**
 * Approve a treaty for your alliance
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<Treaty| ApproveTreatyPaginator>}
 */
export default async function approveTreatyMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Treaty>;
export default async function approveTreatyMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<ApproveTreatyPaginator>;
export default async function approveTreatyMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<Treaty | ApproveTreatyPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationApproveTreatyArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
      approveTreaty${argsToParameters} {
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
  `, 
  this.apiKey,
  this.bot_key,
  this.bot_apiKey,
  );

  this.setRateLimit(res.rateLimit);

  if (paginator) {
    return res.data.cities;
  }

  return res.data.bankDeposit as Treaty;
}
