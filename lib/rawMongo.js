/**
 * rawMongo.js
 * Helpers to interact with MongoDB collections via Prisma's $runCommandRaw.
 * Used because Mongoose's dbConnect() fails when Atlas DNS SRV is unreachable,
 * while Prisma's existing connection pool stays alive.
 */
import prisma from '@/lib/prisma';
import mongoose from 'mongoose'; // ObjectId generation only – no connection needed

// ── ID helpers ──────────────────────────────────────────────
export function newOid() {
  return new mongoose.Types.ObjectId().toHexString();
}

export function toOidFilter(hexId) {
  return { $oid: hexId };
}

export function parseOid(val) {
  if (!val) return null;
  if (typeof val === 'object' && val.$oid) return val.$oid;
  return String(val);
}

// ── Date helpers ─────────────────────────────────────────────
export function toDateRaw(d) {
  if (!d) return null;
  return { $date: { $numberLong: String(new Date(d).getTime()) } };
}

export function parseDateRaw(val) {
  if (!val) return null;
  if (typeof val === 'object' && val.$date) {
    const ts = val.$date.$numberLong ?? val.$date;
    return new Date(typeof ts === 'string' ? parseInt(ts, 10) : ts).toISOString();
  }
  if (val instanceof Date) return val.toISOString();
  return null;
}

// ── ResultUpload serializers ─────────────────────────────────
export function serializeUploadList(doc) {
  return {
    ...doc,
    _id: parseOid(doc._id),
    createdAt: parseDateRaw(doc.createdAt),
    updatedAt: parseDateRaw(doc.updatedAt),
    publishedAt: parseDateRaw(doc.publishedAt),
    entries: undefined,
    auditLog: undefined,
  };
}

export function serializeUploadFull(doc) {
  return {
    ...doc,
    _id: parseOid(doc._id),
    createdAt: parseDateRaw(doc.createdAt),
    updatedAt: parseDateRaw(doc.updatedAt),
    publishedAt: parseDateRaw(doc.publishedAt),
    entries: (doc.entries || []).map(e => ({
      student: parseOid(e.student),
      grade: e.grade,
    })),
  };
}

// ── Low-level raw ops ────────────────────────────────────────
export async function rawFind(collection, filter = {}, opts = {}) {
  const cmd = { find: collection, filter, ...opts };
  const res = await prisma.$runCommandRaw(cmd);
  return res.cursor?.firstBatch ?? [];
}

export async function rawFindOne(collection, filter) {
  const docs = await rawFind(collection, filter, { limit: 1 });
  return docs[0] ?? null;
}

export async function rawInsert(collection, doc) {
  const res = await prisma.$runCommandRaw({ insert: collection, documents: [doc] });
  if (!res.ok) throw new Error(`Insert into ${collection} failed`);
  return res;
}

export async function rawUpdate(collection, filter, update) {
  const res = await prisma.$runCommandRaw({
    update: collection,
    updates: [{ q: filter, u: update }],
  });
  if (!res.ok) throw new Error(`Update in ${collection} failed`);
  return res;
}

export async function rawDelete(collection, filter) {
  const res = await prisma.$runCommandRaw({
    delete: collection,
    deletes: [{ q: filter, limit: 1 }],
  });
  if (!res.ok) throw new Error(`Delete in ${collection} failed`);
  return res;
}

export async function rawUpsert(collection, filter, update) {
  const res = await prisma.$runCommandRaw({
    update: collection,
    updates: [{ q: filter, u: update, upsert: true }],
  });
  if (!res.ok) throw new Error(`Upsert in ${collection} failed`);
  return res;
}
