import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react"

// This is the chain your dApp will work on.
const activeChain = "avalanche";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
    activeChain={activeChain}
    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <Analytics/>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
