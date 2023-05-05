import { Kit } from '../../..';
import {
  TaxBracket,
  CreateTaxBracketPaginator,
  MutationDeleteTaxBracketArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id: number;
}

/**
 * Approve a treaty for your alliance
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<TaxBracket| CreateTaxBracketPaginator>}
 */
export default async function deleteTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<TaxBracket>;
export default async function deleteTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<CreateTaxBracketPaginator>;
export default async function deleteTaxBracketMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<TaxBracket | CreateTaxBracketPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationDeleteTaxBracketArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
        deleteTaxBracket${argsToParameters} {
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
