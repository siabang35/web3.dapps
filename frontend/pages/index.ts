import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <h1>My DApp</h1>
      <ConnectButton />
      {isConnected && <p>Connected wallet: {address}</p>}
    </div>
  );
}
