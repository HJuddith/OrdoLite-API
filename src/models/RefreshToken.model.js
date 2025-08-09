import { DataTypes, Model } from 'sequelize';

export class RefreshToken extends Model {}

export default (sequelize) => {
  RefreshToken.init(
    {
      token_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      device_info: {
        type: DataTypes.STRING(100),
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_token',
      timestamps: false,
    }
  );

  return RefreshToken;
};
