import { DataTypes, Model } from 'sequelize';

export class ResetPassword extends Model {}

export default (sequelize) => {
  ResetPassword.init(
    {
      reset_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ResetPassword',
      tableName: 'reset_password',
      timestamps: false,
    }
  );

  return ResetPassword;
};
