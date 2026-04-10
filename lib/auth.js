import { signIn, signOut, getSession } from "next-auth/react";

export const login = async (email, password) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  if (result?.error) throw new Error("Invalid credentials");
  return result;
};

export const logout = async () => {
  await signOut({ redirect: false });
  window.location.href = "/";
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};

export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};
