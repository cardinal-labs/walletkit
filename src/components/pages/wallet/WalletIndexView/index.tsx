import { usePubkey } from "@saberhq/sail";
import { useParams } from "react-router-dom";

import { SmartWalletInner } from "./SmartWalletInner";

export const WalletIndexView: React.FC = () => {
  const { walletKey: walletKeyStr } = useParams<{ walletKey: string }>();
  const walletKey = usePubkey(walletKeyStr);

  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }

  return <SmartWalletInner walletKey={walletKey} />;
};
