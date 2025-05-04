import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/contexts/web3-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import DonorRegistry from "@/pages/donor-registry";
import RecipientRegistry from "@/pages/recipient-registry";
import Matching from "@/pages/matching";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/donor-registry" component={DonorRegistry} />
      <Route path="/recipient-registry" component={RecipientRegistry} />
      <Route path="/matching" component={Matching} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
