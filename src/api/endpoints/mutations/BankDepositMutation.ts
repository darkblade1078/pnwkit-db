import { Kit } from '../../..';
import {
  Bankrec,
  BankDepositPaginator,
  MutationBankDepositArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
  id?: number[];
  nation_id?: number[];
  first?: number;
  page?: number;
}

/**
 * Gets a list of cities
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<City[] | CityPaginator>}
 */
export default async function bankDepositMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Bankrec[]>;
export default async function bankDepositMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<BankDepositPaginator>;
export default async function bankDepositMutation(
  this: Kit,
  params: Parameters,
  query: string,
  paginator?: boolean,
): Promise<Bankrec[] | BankDepositPaginator> {
  const argsToParameters = GraphQL.generateParameters(params as MutationBankDepositArgs);

  const res = await GraphQL.makeMutationCall(`
    mutation {
       bankDeposit${argsToParameters} {
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

  return res.data.bankDeposit as Bankrec[];
}
