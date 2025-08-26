import { DataTypes, Model } from 'sequelize';

export class Medication extends Model {}

export default (sequelize) => {
  Medication.init(
    {
      medication_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      brand_name: {
        type: DataTypes.STRING(100),
      },
      short_description: {
        type: DataTypes.TEXT,
      },
      form: {
        type: DataTypes.STRING(50),
      },
      base_dosage: {
        type: DataTypes.STRING(50),
      },
      expiration_date: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      sequelize,
      modelName: 'Medication',
      tableName: 'medication',
    }
  );

  return Medication;
};
