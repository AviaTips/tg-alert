import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Alert = sequelize.define('Alert', {
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        isUppercase: true,
        len: [2, 3],
      },
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        isUppercase: true,
        len: [2, 3],
      },
    },
    type: {
      type: DataTypes.ENUM('oneway', 'return'),
      allowNull: false,
    },
    range: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      validate: {
        validRange(value) {
          if (value) {
            if (value.length !== 2) {
              throw new Error('Range must have 2 values');
            }
            for (const range of value) {
              if (range < 1 || range > 90 || range === null) {
                throw new Error('Range must be between 1 and 90');
              }
            }
          }
        },
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        isUppercase: true,
        len: 3,
      },
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        isLowercase: true,
        len: [2, 3],
      },
    },
  }, {
    tableName: 'alerts',
    paranoid: true,
    validate: {
      validAlert() {
        if (this.origin === this.destination) {
          throw new Error('Origin and Destination must be different');
        }
      },
    },
  });
  return Alert;
}
