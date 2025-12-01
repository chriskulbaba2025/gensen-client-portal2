"use client";

export default function ErrorPage({ error }: { error: any }) {
  return <pre>{JSON.stringify(error, null, 2)}</pre>;
}
