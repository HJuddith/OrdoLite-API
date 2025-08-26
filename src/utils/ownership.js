export function assertOwnershipOrAdmin(entityUserId, reqUser) {
  if (!reqUser) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  if (reqUser.role === 'ADMIN') return;
  if (Number(entityUserId) !== Number(reqUser.userId)) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}