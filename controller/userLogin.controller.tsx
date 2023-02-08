import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenError, TokenResponse } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import { User } from '../types/dings.types';
import { fetchData } from './wrapper';

WebBrowser.maybeCompleteAuthSession();

export default function userLoginController() {
  const [user, setUser] = useState<User | null>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);

  const [isLoadingAuthState, setIsLoadingAuthState] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Config.CLIENT_ID,
    iosClientId: Config.IOS_CLIENT_ID,
    androidClientId: Config.ANDROID_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const signIn = async () => {
    if (!(await isLoggedIn())) {
      await promptAsync();
    }
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

  // TODO: Check if we need async or secure storage
  async function getAuthState(): Promise<TokenResponse | null> {
    const jsonValue = await AsyncStorage.getItem('@authState');

    if (jsonValue == null) return null;

    const authConfig: AuthSession.TokenResponseConfig = JSON.parse(jsonValue!);

    const authState = new AuthSession.TokenResponse(authConfig);

    if (authState == null) return null;

    return authState;
  }

  async function setAuthState(authState: TokenResponse | null) {
    if (authState == null) {
      await AsyncStorage.removeItem('@authState');
    } else {
      const jsonValue = JSON.stringify(authState.getRequestConfig());

      await AsyncStorage.setItem('@authState', jsonValue);
    }
  }

  function getClientId() {
    if (Platform.OS === 'ios') {
      return Config.IOS_CLIENT_ID;
    } else if (Platform.OS === 'android') {
      return Config.ANDROID_CLIENT_ID;
    } else {
      console.error('Invalid platform - not handled');
    }
  }

  async function autoRenewAuth() {
    const clientId = getClientId();

    const authState = await getAuthState();

    if (authState == null) {
      return false;
    }

    if (authState.shouldRefresh()) {
      try {
        const tokenResult = await authState.refreshAsync(
          {
            clientId: clientId!,
          },
          Google.discovery
        );

        if (tokenResult.accessToken === undefined) {
          return false;
        }

        tokenResult.refreshToken = authState.refreshToken;

        await setAuthState(tokenResult);
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
      setAuthState(response.authentication)
        .then(() => fetchUserInfo())
        .then(() => setIsSignedIn(true));
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
