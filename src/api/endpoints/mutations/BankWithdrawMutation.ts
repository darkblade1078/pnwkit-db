import { Kit } from '../../..';
import {
    Bankrec,
    BankWithdrawPaginator,
    MutationBankWithdrawArgs,
} from '../../../interfaces/PoliticsAndWarGraphQL';
import GraphQL from '../../../services/GraphQL';

export interface Parameters {
    receiver: string;
    receiver_type: number;
    money?: number;
    coal?: number;
    oil?: number;
    uranium?: number;
    iron?: number;
    bauxite?: number;
    lead?: number;
    gasoline?: number;
    munitions?: number;
    steel?: number;
    aluminum?: number;
    food?: number;
    note?: string;
}

/**
 * Withdraw resources from your bank
 * @param {Parameters} params Query parameters to customize your results
 * @param {string} query The graphql query to get info with
 * @param {boolean} paginator If true it will return paginator info
 * @return {Promise<Bankrec | BankWithdrawPaginator>}
 */
export default async function bankWithdrawMutation(this: Kit, params: Parameters, query: string, paginator?: false): Promise<Bankrec>;
export default async function bankWithdrawMutation(this: Kit, params: Parameters, query: string, paginator: true): Promise<BankWithdrawPaginator>;
export default async function bankWithdrawMutation(
    this: Kit,
    params: Parameters,
    query: string,
    paginator?: boolean,
): Promise<Bankrec | BankWithdrawPaginator> {
    const argsToParameters = GraphQL.generateParameters(params as MutationBankWithdrawArgs);

    const res = await GraphQL.makeMutationCall(`
    mutation {
        bankWithdraw${argsToParameters} {
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

    return res.data.bankDeposit as Bankrec;
}
