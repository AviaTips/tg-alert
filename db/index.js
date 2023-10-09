import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  username: process.env.POSTGRES_USER || 'pguser',
  password: process.env.POSTGRES_PASSWORD || '12345',
  database: process.env.POSTGRES_DB || 'alerts',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || 5432,
  dialect: 'postgres',
});

(await import('./models/alert.js')).default(sequelize);

await sequelize.models.Alert.sync({ alter: true });

export default sequelize;
