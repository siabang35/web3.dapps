import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubgraphService {
  private readonly logger = new Logger(SubgraphService.name);
  private subgraphUrl: string;

  constructor(private configService: ConfigService) {
    this.subgraphUrl = this.configService.get<string>('SUBGRAPH_URL');
  }

  async query(query: string, variables: any = {}): Promise<any> {
    try {
      if (!this.subgraphUrl) {
        throw new Error('Subgraph URL not configured');
      }

      const response = await fetch(this.subgraphUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data;
    } catch (error) {
      this.logger.error(`Failed to query subgraph: ${error.message}`);
      throw error;
    }
  }

  async getTokenData(tokenAddress: string): Promise<any> {
    const query = `
      query GetToken($address: String!) {
        token(id: $address) {
          id
          name
          symbol
          decimals
          totalSupply
          volume
          txCount
        }
      }
    `;

    const result = await this.query(query, { address: tokenAddress.toLowerCase() });
    return result.token;
  }

  async getSwapEvents(limit: number = 10): Promise<any[]> {
    const query = `
      query GetSwaps($limit: Int!) {
        swaps(first: $limit, orderBy: timestamp, orderDirection: desc) {
          id
          timestamp
          pair {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
          amount0In
          amount1In
          amount0Out
          amount1Out
          sender
          to
        }
      }
    `;

    const result = await this.query(query, { limit });
    return result.swaps;
  }

  async getUserTransactions(userAddress: string, limit: number = 50): Promise<any[]> {
    const query = `
      query GetUserTransactions($user: String!, $limit: Int!) {
        user(id: $user) {
          id
          swaps(first: $limit, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            pair {
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
            }
            amount0In
            amount1In
            amount0Out
            amount1Out
          }
        }
      }
    `;

    const result = await this.query(query, { 
      user: userAddress.toLowerCase(),
      limit 
    });
    
    return result.user?.swaps || [];
  }
}