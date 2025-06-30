import { Hono } from "hono";
import { verify } from "hono/jwt";
import type { Context, MiddlewareHandler } from "hono";

export function initMiddleware(
  app: Hono<{
    Bindings: { JWT_SECRET: string };
    Variables: { userId: string }; // 👈 Needed to support c.set('userId')
  }>
) {
  const authMiddleware: MiddlewareHandler = async (c, next) => {
    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1];

    if (!token) {
      c.status(401);
      return c.json({ error: "unauthorized - token missing" });
    }

    try {
      const payload = await verify(token, c.env.JWT_SECRET);

      if (payload && typeof payload.id === "string") {
        c.set("userId", payload.id); // 👈 Make user ID available to downstream
        return await next();         // ✅ Don't forget return
      } else {
        c.status(403);
        return c.json({ error: "unauthorized - invalid token" });
      }
    } catch (err) {
      c.status(403);
      return c.json({ error: "unauthorized - token verification failed" });
    }
  };

  app.use("/api/v1/blog/*", authMiddleware);
}


