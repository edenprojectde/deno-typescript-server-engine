export interface IGoogleKeys {
    keys: Key[];
  }
  
  interface Key {
    kty: string;
    kid: string;
    e: string;
    alg: string;
    use: string;
    n: string;
  }