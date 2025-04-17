import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'My DApp',
  projectId: 'your_walletconnect_project_id',
  chains: [sepolia],
  ssr: true,
});
