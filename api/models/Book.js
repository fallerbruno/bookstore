const { DataTypes, Model } = require('sequelize');
const db = require('../db');
const Publisher = require('./Publisher')
const Categories = require('./Category')
class Book extends Model { }

Book.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publication_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    sequelize: db,
    tableName: 'books',
    modelName: 'Book',
})

Publisher.hasMany(Book);
Categories.hasMany(Book);
Book.belongsTo(Categories);
Book.belongsTo(Publisher);

module.exports = Book;