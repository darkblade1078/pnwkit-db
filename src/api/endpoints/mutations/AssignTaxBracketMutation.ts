import { Kit } from '../../..';
import {
  TaxBracket,
  AssignTaxBracketPaginator,
  MutationAssignTaxBracketArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id: number;
  target_id: number;
}

/**
 * Approve a treaty for your alliance
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<TaxBracket| AssignTaxBracketPaginator>}
 */
export default async function assignTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<TaxBracket>;
export default async function assignTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<AssignTaxBracketPaginator>;
export default async function assignTaxBracketMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<TaxBracket | AssignTaxBracketPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationAssignTaxBracketArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
        assignTaxBracket${argsToParameters} {
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

  return res.data.bankDeposit as TaxBracket;
}
