import { get } from 'lodash';
import { signJwt, verifyJwt } from '../utils/jwt';
import AppDataSource from '../../data-source';
import { Auth } from '../entity/Auth.entity';
import { User } from '../entity/User.entity';
import config from 'config';

export async function reIssueAccessToken(refreshToken: string) {
  const authRepository = AppDataSource.getRepository(Auth);
  const userRepository = AppDataSource.getRepository(User);

  const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublic');

  if (!decoded || !get(decoded, 'session')) return false;

  const sessionId = get(decoded, 'session');

  const session = await authRepository.findOneBy({ id: sessionId });

  if (!session || !session.valid) return false;

  const user = await userRepository.findOneBy({ id: String(session.userId) });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session.id },
    'accessTokenPrivate',
    { expiresIn: config.get<string>('accessTokenTtl') },
  );

  return accessToken;
}
