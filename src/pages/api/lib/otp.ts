import { Env } from '.environments';
import * as Otp from 'otp-without-db';

export const generateOtpHash = (identifier: string, otp: number): string => {
  return Otp.createNewOTP(identifier, otp, Env.supabaseJwtSecret, 5);
};

export const verifyOtpHash = (identifier: string, otp: number, otpHash: string): boolean => {
  return Otp.verifyOTP(identifier, otp, otpHash, Env.supabaseJwtSecret);
};
