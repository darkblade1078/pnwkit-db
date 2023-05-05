import { Kit } from '../../..';
import {
  TaxBracket,
  EditTaxBracketPaginator,
  MutationEditTaxBracketArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id: string
  name?: string;
  money_tax_rate?: number;
  resource_tax_rate?: number;
}

/**
 * Approve a treaty for your alliance
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<TaxBracket| EditTaxBracketPaginator>}
 */
export default async function editTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<TaxBracket>;
export default async function editTaxBracketMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<EditTaxBracketPaginator>;
export default async function editTaxBracketMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<TaxBracket | EditTaxBracketPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationEditTaxBracketArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
        editTaxBracket${argsToParameters} {
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
