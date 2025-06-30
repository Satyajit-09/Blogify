import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "../../../common/src"; // ✅ your shared zod schemas

// Reusable prisma factory for Cloudflare Workers
const getPrisma = (url: string) =>
  new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

export const bookRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// ✅ Auth middleware
bookRouter.use(async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth) {
    c.status(401);
    return c.json({ error: "unauthorized - no token" });
  }

  const token = auth.split(" ")[1];
  const payload = await verify(token, c.env.JWT_SECRET);

  if (!payload || typeof payload.id !== "string") {
    c.status(401);
    return c.json({ error: "unauthorized - invalid token" });
  }

  c.set("userId", payload.id);
  return await next();
});

// ✅ POST / - Create Post
bookRouter.post("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

  const body = await c.req.json();
  const parsed = createPostInput.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.flatten().fieldErrors });
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: userId,
    },
  });

  return c.json({ id: post.id });
});

// ✅ PUT / - Update Post
bookRouter.put("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

  const body = await c.req.json();
  const parsed = updatePostInput.extend({ id: z.string() }).safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.flatten().fieldErrors });
  }

  const { id, title, content } = parsed.data;

  try {
    const updated = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return c.json({ success: true, post: updated });
  } catch (err) {
    c.status(404);
    return c.json({ error: "Post not found or not authorized" });
  }
});

// ✅ GET /:id - Get Post by ID
bookRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    c.status(404);
    return c.json({ error: "Post not found" });
  }

  return c.json(post);
});
