import jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
}

const createToken = (payload: Payload): string => {
  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRE_TIME) {
    throw new Error(
      'JWT_SECRET_KEY or JWT_EXPIRE_TIME is not defined in environment variables'
    );
  }

  return jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

export default createToken;
