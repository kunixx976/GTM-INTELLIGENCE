'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div>Terminal Core Dump: {error.message}</div>;
}