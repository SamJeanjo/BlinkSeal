export function getClerkPublishableKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  return key?.startsWith("pk_") ? key : null;
}

export function hasClerkServerConfig() {
  return Boolean(getClerkPublishableKey() && process.env.CLERK_SECRET_KEY?.trim().startsWith("sk_"));
}
