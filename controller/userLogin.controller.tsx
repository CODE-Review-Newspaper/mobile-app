import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TokenError,
  TokenResponse,
  TokenResponseConfig,
} from 'expo-auth-session';

import { User } from '../types/dings.types';
import { fetchData } from './wrapper';

WebBrowser.maybeCompleteAuthSession();

export default function userLoginController() {
  const [user, setUser] = useState<User | null>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoadingAuthState, setIsLoadingAuthState] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com',
    iosClientId:
      '614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com',
    androidClientId:
      '614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const signIn = async () => {
    if (!(await isLoggedIn())) {
      await promptAsync();
    }
    setIsSignedIn(true);
  };

  const signOut = async () => {
    if (await isLoggedIn(false)) {
      const authState = await getAuthState();

      if (authState != null) {
        await AuthSession.revokeAsync(
          { token: authState.accessToken },
          Google.discovery
        );
      }
    }
    await setAuthState(null);

    setUser(null);
    setIsSignedIn(false);
  };

  async function isLoggedIn(shouldFetchUserInfo = true) {
    const authState = await getAuthState();

    const loggedIn = (authState != null && (await autoRenewAuth()))!;

    setIsSignedIn(loggedIn);

    if (loggedIn && shouldFetchUserInfo) {
      fetchUserInfo();
    }
    setIsLoadingAuthState(false);

    return loggedIn;
  }

  async function getAuthState(): Promise<TokenResponse | null> {
    const jsonValue = await AsyncStorage.getItem('@authState');
    const obj: TokenResponseConfig = JSON.parse(jsonValue!);

    return obj != null ? new AuthSession.TokenResponse(obj) : null;
  }

  async function setAuthState(authState: TokenResponse | null) {
    if (authState == null) {
      await AsyncStorage.removeItem('@authState');
    } else {
      const jsonValue = JSON.stringify(authState.getRequestConfig());
      await AsyncStorage.setItem('@authState', jsonValue);
    }
  }

  async function autoRenewAuth() {
    const authState = await getAuthState();

    if (authState === null) {
      return false;
    }

    if (authState.shouldRefresh()) {
      try {
        const refresh = await authState.refreshAsync(
          {
            clientId:
              '614417646190-dbl1mao4r8bcjmam2cmcgtfo4c35ho1h.apps.googleusercontent.com',
            clientSecret: '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',
          },
          Google.discovery
        );

        if (refresh.accessToken === undefined) {
          return false;
        }

        await setAuthState(refresh);
      } catch (e) {
        if (e instanceof TokenError) {
          if (e.code === 'invalid_grant') {
            console.error('invalid grant, prompting for new grant');

            await setAuthState(null);
            await signIn();

            return;
          }
        }
        console.error(
          'error inside autoRenewAuth:',
          JSON.stringify(e, null, 2)
        );
      }
    }
    return true;
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setAuthState(response.authentication).then(() => fetchUserInfo());
    }
  }, [response]);

  async function fetchUserInfo() {
    const [errorUserData, meRes] = await fetchData(
      'https://www.googleapis.com/userinfo/v2/me',
      await getAuthState()
    );

    if (errorUserData != null)
      console.error('error trying to fetchUserInfo:', errorUserData);

    const userInfo: User = await meRes!.json();

    setUser(userInfo);
  }
  useEffect(() => {
    isLoggedIn();
  }, []);

  return {
    user,
    isSignedIn,
    isLoadingAuthState,
    signIn,
    signOut,
    getAuthState,
  };
}
