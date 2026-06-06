"use client";

import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";

export async function registerUser(
  email: string,
  password: string
): Promise<{ needsConfirmation: boolean }> {
  const result = await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });

  return { needsConfirmation: !result.isSignUpComplete };
}

export async function verifyEmail(email: string, code: string) {
  await confirmSignUp({ username: email, confirmationCode: code });
}

export async function loginUser(email: string, password: string) {
  const result = await signIn({ username: email, password });
  if (!result.isSignedIn) {
    throw new Error("Sign in incomplete");
  }
}

export async function logoutUser() {
  await signOut();
}

export async function getAuthEmail(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user.signInDetails?.loginId ?? user.username ?? null;
  } catch {
    return null;
  }
}

export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getIdToken();
  return Boolean(token);
}
