import { Event, XnftMetadata } from "@coral-xyz/common-public";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    xnft: any;
  }
}

export { useColorScheme } from "react-native";

/** @deprecated use `usePublicKeys()` instead */
export function usePublicKey(): PublicKey {
  const [publicKey, setPublicKey] = useState(window.xnft.solana?.publicKey);
  useEffect(() => {
    window.xnft.solana?.on("publicKeyUpdate", () => {
      setPublicKey(window.xnft.solana.publicKey);
    });
  }, [setPublicKey]);
  return publicKey;
}

export function usePublicKeys(): { [blockchain: string]: string } {
  const [publicKeys, setPublicKeys] = useState(window.xnft?.publicKeys);
  useEffect(() => {
    window.xnft.on("publicKeysUpdate", () => {
      setPublicKeys(window.xnft.publicKeys);
    });
  }, [setPublicKeys]);
  return publicKeys;
}

/** @deprecated use blockchain-specific connections instead */
export function useConnection(): Connection {
  const [connection, setConnection] = useState(window.xnft.solana?.connection);
  useEffect(() => {
    window.xnft.solana?.on("connectionUpdate", () => {
      setConnection(window.xnft.solana.connection);
    });
  }, [setConnection]);
  return connection;
}

export function useSolanaConnection(): Connection {
  const [connection, setConnection] = useState(window.xnft.solana?.connection);
  useEffect(() => {
    window.xnft.solana?.on("connectionUpdate", () => {
      setConnection(window.xnft.solana.connection);
    });
  }, [setConnection]);
  return connection;
}

export function useEthereumConnection(): Connection {
  const [connection, setConnection] = useState(
    window.xnft.ethereum?.connection
  );
  useEffect(() => {
    window.xnft.ethereum?.on("connectionUpdate", () => {
      setConnection(window.xnft.ethereum.connection);
    });
  }, [setConnection]);
  return connection;
}

// Returns true if the `window.xnft` object is ready to be used.
export function useDidLaunch() {
  const [didConnect, setDidConnect] = useState(false);
  useEffect(() => {
    window.addEventListener("load", () => {
      window.xnft.on("connect", () => {
        setDidConnect(true);
      });
      window.xnft.on("disconnect", () => {
        setDidConnect(false);
      });
    });
  }, []);
  return didConnect;
}

export const useReady = useDidLaunch;

export function useMetadata(): XnftMetadata {
  const [metadata, setMetadata] = useState(window.xnft?.metadata || {});

  useEffect(() => {
    setMetadata(window.xnft?.metadata || {});
    window.xnft.addListener("metadata", (event: Event) => {
      setMetadata(event.data.metadata);
    });
  }, []);
  return metadata;
}

export function useDimensions(debounceMs = 0) {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const debounce = (fn: Function) => {
    let timer: ReturnType<typeof setTimeout>;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        clearTimeout(timer);
        // @ts-ignore
        fn.apply(this, arguments);
      }, debounceMs);
    };
  };

  useEffect(() => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  return dimensions;
}
