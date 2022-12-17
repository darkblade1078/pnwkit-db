import { Kit } from '../../..';
import {
  TaxBracket,
  DeleteTaxBracketPaginator,
  MutationCreateTaxBracketArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
    name: string;
    money_tax_rate: number;
    resource_tax_rate: number;
}

/**
 * Approve a treaty for your alliance
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<TaxBracket| DeleteTaxBracketPaginator>}
 */
export default async function createTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<TaxBracket>;
export default async function createTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<DeleteTaxBracketPaginator>;
export default async function createTaxBracketMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<TaxBracket | DeleteTaxBracketPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationCreateTaxBracketArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
        createTaxBracket${argsToParameters} {
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

  return res.data.bankDeposit as TaxBracket;
}
