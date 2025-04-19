module.exports = (sequelize, Sequelize) => {
  const Evento = sequelize.define("evento", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false
    },
    color: {
      type: Sequelize.STRING,
      defaultValue: "#3788d8"
    },
    allDay: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Evento;
}; 