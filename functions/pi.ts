export async function onRequest({ request, env }) {
  return new Response("PI FUNCTION HIT", { status: 200 });
}
