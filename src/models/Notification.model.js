import { DataTypes, Model } from 'sequelize';

export class Notification extends Model {}

export default (sequelize) => {
  Notification.init(
    {
      notif_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      notif_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [
            ['medication_reminder', 'prescription_expiry', 'new_prescription'],
          ],
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
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
      modelName: 'Notification',
      tableName: 'notification',
    }
  );

  return Notification;
};
