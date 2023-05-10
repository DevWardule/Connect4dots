const { DATE } = require("sequelize");

module.exports = (sequelize,DataTypes) => {
    
    const match = sequelize.define('matchrecord',{
        id:{
            type : DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total:{
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        wins:{
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        loss:{
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        rating:{
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        maxRatings:{
            type : DataTypes.INTEGER,
            defaultValue : 0
        }
    })

    return match;
}

