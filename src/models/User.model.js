import { DataTypes, Model } from 'sequelize';

export class User extends Model {}

export default (sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['USER', 'ADMIN']],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: "user",
    }
  );

  return User;
};
