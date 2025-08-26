import { DataTypes, Model } from 'sequelize';

export class Attachment extends Model {}

export default (sequelize) => {
  Attachment.init(
    {
      attachment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      mime_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      file_size_bytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sha256: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      prescription_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Attachment',
      tableName: 'attachment',
      timestamps: false,
    }
  );

  return Attachment;
};
