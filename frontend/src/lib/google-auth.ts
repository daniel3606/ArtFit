import { api, auth } from './api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export interface GoogleAuthResponse {
  user: any;
  access: string;
  refresh: string;
  is_new_user: boolean;
}

export async function handleGoogleLogin(credential: string): Promise<GoogleAuthResponse> {
  const response = await api.post('/accounts/google-auth/', { token: credential });
  
  const { access, refresh } = response.data;
  
  // Store tokens
  if (access && refresh) {
    auth.access = access;
    auth.refresh = refresh;
  }
  
  return response.data;
}

export function initGoogleOneTap(onSuccess: (response: GoogleAuthResponse) => void, onError?: (error: any) => void) {
  if (!window.google || !GOOGLE_CLIENT_ID) {
    console.warn('Google Sign-In not available or CLIENT_ID not configured');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (response: any) => {
      try {
        const result = await handleGoogleLogin(response.credential);
        onSuccess(result);
      } catch (err) {
        console.error('Google login failed:', err);
        if (onError) onError(err);
      }
    },
  });
}

export function renderGoogleButton(
  element: HTMLElement,
  onSuccess: (response: GoogleAuthResponse) => void,
  onError?: (error: any) => void
) {
  if (!window.google || !GOOGLE_CLIENT_ID) {
    console.warn('Google Sign-In not available or CLIENT_ID not configured');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (response: any) => {
      try {
        const result = await handleGoogleLogin(response.credential);
        onSuccess(result);
      } catch (err) {
        console.error('Google login failed:', err);
        if (onError) onError(err);
      }
    },
  });

  window.google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    width: element.offsetWidth,
    text: 'continue_with',
  });
}

