export const sessionPolicy = {
  ttlDays: 30,
  rotateOnLogin: false,
  httpOnly: true,
  sameSite: 'lax' as const,
};
