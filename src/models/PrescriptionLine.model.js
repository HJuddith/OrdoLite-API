import { DataTypes, Model } from 'sequelize';

export class PrescriptionLine extends Model {}

export default (sequelize) => {
  PrescriptionLine.init(
    {
      line_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
      },
      dose: {
        type: DataTypes.DECIMAL(10, 3),
      },
      unit: {
        type: DataTypes.STRING(20),
      },
      frequency_day: {
        type: DataTypes.INTEGER,
      },
      instructions: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING(20),
        validate: {
          isIn: [['active', 'completed', 'paused']],
        },
      },
      prescription_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      medication_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PrescriptionLine',
      tableName: 'prescription_line',
    }
  );

  return PrescriptionLine;
};
