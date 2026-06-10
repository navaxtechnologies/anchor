// Document Vault storage abstraction. MOCKED in Phase 1.
//
// The app only ever holds DOCUMENT METADATA (DocumentMeta). Raw bytes go through this
// abstraction, which is designed for a zero-knowledge / client-side-key pattern:
//
//   Integration (M4): generate a per-user data key, wrap it with a key derived from a
//   device secret (expo-secure-store) + optional passphrase (envelope encryption),
//   encrypt bytes client-side, upload ciphertext to Supabase Storage. The server never
//   sees plaintext or the unwrapped key. `storagePath` below is the ciphertext handle.

import { storage } from './supabase';
import type { DocumentMeta } from '@/types';

const KEY = 'documents';

export async function listDocuments(): Promise<DocumentMeta[]> {
  return (await storage.get<DocumentMeta[]>(KEY)) ?? [];
}

export async function addDocument(
  meta: Omit<DocumentMeta, 'id' | 'storagePath' | 'createdAt'>
): Promise<DocumentMeta> {
  const docs = await listDocuments();
  const doc: DocumentMeta = {
    ...meta,
    id: 'doc-' + (docs.length + 1) + '-' + meta.title.slice(0, 6).replace(/\s/g, ''),
    // In production this is a ciphertext handle, not a readable path.
    storagePath: `enc://vault/${meta.category}/${docs.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  await storage.set(KEY, [doc, ...docs]);
  return doc;
}

export async function removeDocument(id: string): Promise<void> {
  const docs = await listDocuments();
  await storage.set(
    KEY,
    docs.filter((d) => d.id !== id)
  );
}
