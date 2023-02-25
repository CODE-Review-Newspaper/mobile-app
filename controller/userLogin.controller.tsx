import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStorage from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import dayjs from 'dayjs';
import { TokenError, TokenResponse } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import { USER_SCHEDULE_FETCH_TIME_DAYS } from '../data/time.data';
import { GoogleEventsResponse, GoogleUser } from '../googleClient/google.types';
import { fetchData } from './wrapper';

WebBrowser.maybeCompleteAuthSession();

interface GoogleChunkFormData {
  _parts: string[][];
}

const getJsonFromGoogleChunkResponse = async <T = any,>(res: Response) => {
  const formData = (await res.formData()) as unknown as GoogleChunkFormData;

  const stringifiedObject = formData._parts.map((i) => i.join('')).join('');

  const object: T = JSON.parse(stringifiedObject);

  return object;
};

export default function userLoginController() {
  const [user, setUser] = useState<GoogleUser | null>(null);

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
    const jsonValue = await SecureStorage.getItemAsync('authState');

    if (jsonValue == null) return null;

    const authConfig: AuthSession.TokenResponseConfig = JSON.parse(jsonValue!);

    const authState = new AuthSession.TokenResponse(authConfig);

    if (authState == null) return null;

    return authState;
  }

  async function setAuthState(authState: TokenResponse | null) {
    if (authState == null) {
      await SecureStorage.deleteItemAsync('authState');
    } else {
      const jsonValue = JSON.stringify(authState.getRequestConfig());

      await SecureStorage.setItemAsync('authState', jsonValue);
    }
  }

  function getClientId() {
    if (Platform.OS === 'ios') {
      return '614417646190-vcu5a3ini5nnr0elfaqt8fprs358mp2i.apps.googleusercontent.com';
    } else if (Platform.OS === 'android') {
      return '614417646190-hhupm8k97a22rvv2gfdcoqi1gus8qunq.apps.googleusercontent.com';
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

    const userInfo: GoogleUser = await meRes!.json();

    setUser(userInfo);
  }

  async function fetchUserEvents() {
    const fromDate = dayjs();

    const untilDate = dayjs().add(USER_SCHEDULE_FETCH_TIME_DAYS, 'days');

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${fromDate.toISOString()}&timeMax=${untilDate.toISOString()}`;

    const [error, eventsData] = await fetchData(url, await getAuthState());

    if (error != null) {
      console.error('Could not get events from User: ', error, eventsData);

      return [new Error(), null] as const;
    }

    const userEvents =
      await getJsonFromGoogleChunkResponse<GoogleEventsResponse>(eventsData!);

    return [null, userEvents] as const;
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
    fetchUserEvents,
  };
}
