export interface UseAuthInterface {
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}
