import jwt from 'jsonwebtoken';

const accessToken = process.env.ACCESS_TOKEN_SECRET as string;

function generateAccessToken(user: UserType) {
  return jwt.sign(user, accessToken, { expiresIn: '10m' });
}

export default generateAccessToken;
