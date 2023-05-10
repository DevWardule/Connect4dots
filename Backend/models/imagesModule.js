const { Sequelize } = require("sequelize");

module.exports = (sequelize,DataTypes) => {

    const Image = sequelize.define('image', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        data: {
          type: Sequelize.BLOB('long')
        }
      })

      return Image;
}