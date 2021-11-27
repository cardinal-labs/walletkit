import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { IndexView } from "./components/pages/IndexView";
import { WalletCreateView } from "./components/pages/wallet/WalletCreateView";
import { WalletIndexView } from "./components/pages/wallet/WalletIndexView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/wallet/new" component={WalletCreateView} />
      <Route path="/wallets/:walletKey" component={WalletIndexView} />
      <Route exact path="/" component={IndexView} />
      <Redirect to="/" />
    </Switch>
  );
};
