'use client';

import { Amplify } from 'aws-amplify';
import { useMemo, useEffect, useReducer, useCallback } from 'react';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resetPassword,
  getCurrentUser,
  resendSignUpCode,
  fetchAuthSession,
  fetchUserAttributes,
  confirmResetPassword,
} from 'aws-amplify/auth';

import { AMPLIFY_API } from 'src/config-global';

import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

/**
 * DOCS: https://docs.amplify.aws/react/build-a-backend/auth/manage-user-session/
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: `${AMPLIFY_API.userPoolId}`,
      userPoolClientId: `${AMPLIFY_API.userPoolWebClientId}`,
    },
  },
});

enum Types {
  INITIAL = 'INITIAL',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const { userId: currentUser } = await getCurrentUser();

      const userAttributes = await fetchUserAttributes();

      const { idToken, accessToken } = (await fetchAuthSession()).tokens ?? {};

      if (currentUser) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...userAttributes,
              id: userAttributes.sub,
              displayName: `${userAttributes.given_name} ${userAttributes.family_name}`,
              idToken,
              accessToken,
              role: 'admin',
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    await signIn({
      username: email,
      password,
    });

    const userAttributes = await fetchUserAttributes();

    const { idToken, accessToken } = (await fetchAuthSession()).tokens ?? {};

    dispatch({
      type: Types.INITIAL,
      payload: {
        user: {
          ...userAttributes,
          id: userAttributes.sub,
          displayName: `${userAttributes.given_name} ${userAttributes.family_name}`,
          idToken,
          accessToken,
          role: 'admin',
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
          },
        },
      });
    },
    []
  );

  // CONFIRM REGISTER
  const confirmRegister = useCallback(async (email: string, code: string) => {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  }, []);

  // RESEND CODE REGISTER
  const resendCodeRegister = useCallback(async (email: string) => {
    await resendSignUpCode({
      username: email,
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut();
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await resetPassword({ username: email });
  }, []);

  // NEW PASSWORD
  const newPassword = useCallback(async (email: string, code: string, password: string) => {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'amplify',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
      register,
      newPassword,
      forgotPassword,
      confirmRegister,
      resendCodeRegister,
    }),
    [
      status,
      state.user,
      //
      login,
      logout,
      register,
      newPassword,
      forgotPassword,
      confirmRegister,
      resendCodeRegister,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
