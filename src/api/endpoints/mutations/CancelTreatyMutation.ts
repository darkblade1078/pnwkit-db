import { Kit } from '../../..';
import {
  Treaty,
  CancelTreatyPaginator,
  MutationCancelTreatyArgs,
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
 * @return {Promise<Treaty | CancelTreatyPaginator>}
 */
export default async function cancelTreatyMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Treaty>;
export default async function cancelTreatyMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<CancelTreatyPaginator>;
export default async function cancelTreatyMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<Treaty | CancelTreatyPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationCancelTreatyArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
        cancelTreaty${argsToParameters} {
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
    this.botKey,
    this.botKeyApiKey,
  );

  this.setRateLimit(res.rateLimit);

  if (paginator) {
    return res.data.cities;
  }

  return res.data.bankDeposit as Treaty;
}
