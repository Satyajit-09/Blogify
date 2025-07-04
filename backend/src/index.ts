import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { bookRouter } from './routes/blog';
import { cors } from 'hono/cors';

 // allow all origins (development only)

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();


app.use('*', cors()); // allow all origins (development only)

app.route('/api/v1/user', userRouter)
app.route('/api/v1/book', bookRouter)

export default app
