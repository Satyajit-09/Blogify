import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { signupInput, signinInput } from '../../../common/src';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const getPrisma = (url: string) =>
  new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

userRouter.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signupInput.safeParse(body);

    if (!parsed.success) {
      c.status(400);
      return c.json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      c.status(400);
      return c.json({ success: false, error: "Email already registered" });
    }

    // ⚠️ Storing plain passwords - not safe in production!
    const user = await prisma.user.create({
      data: { email, password, name },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ success: true, jwt: token });

  } catch (err) {
    console.error("Signup Error:", err);
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

userRouter.post('/signin', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signinInput.safeParse(body);

    if (!parsed.success) {
      c.status(400);
      return c.json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // ✅ Simple text comparison
    if (!user || password !== user.password) {
      c.status(403);
      return c.json({ success: false, error: "Invalid email or password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ success: true, jwt: token });

  } catch (err) {
    console.error("Signin Error:", err);
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});





