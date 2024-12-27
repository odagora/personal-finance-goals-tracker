import app from './app';
import config from './config';

const port = process.env.PORT || config.port || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`API URL: ${config.api.prefix}`);
  });
}

export default app;
