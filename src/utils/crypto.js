import crypto from 'crypto';

export function sha256OfBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}