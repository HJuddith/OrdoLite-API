import { DataTypes, Model } from 'sequelize';

export class Prescription extends Model {}

export default (sequelize) => {
  Prescription.init(
    {
      prescription_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
      },
      prescriber: {
        type: DataTypes.STRING(100),
      },
      notes: {
        type: DataTypes.TEXT,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Prescription',
      tableName: 'prescription'
    }
  );

  return Prescription;
};
