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
  try {
    const current = await getCurrentUser();
    const currentEmail =
      current.signInDetails?.loginId ?? current.username ?? "";
    const session = await fetchAuthSession();

    if (
      session.tokens?.idToken &&
      currentEmail.toLowerCase() === email.toLowerCase()
    ) {
      return;
    }

    await signOut();
  } catch {
    // No active session — proceed with sign in.
  }

  const result = await signIn({ username: email, password });
  if (!result.isSignedIn) {
    throw new Error("Sign in incomplete");
  }
}

export async function logoutUser() {
  await signOut({ global: true });
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
