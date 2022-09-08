const { DataTypes, Model } = require('sequelize');
const db = require('../db');

class Categories extends Model { }

Categories.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize: db,
    tableName: 'Categories',
    modelName: 'Category',
})


module.exports = Categories;