import config from 'config';
import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = bcrypt.hashSync(password, salt);
  password = hash;
  return password;
}

export async function comparePassword(password: string, hash: any) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (_) {
    return false;
  }
}
