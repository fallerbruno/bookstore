const { DataTypes, Model } = require('sequelize');
const db = require('../db');
const Publisher = require('./Publisher')
const Categories = require('./Category')
const Format = require('./Format')
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
    value: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},{
    sequelize: db,
    tableName: 'books',
    modelName: 'Book',
})

Publisher.hasMany(Book);
Categories.hasMany(Book);
Format.hasMany(Book);
Book.belongsTo(Categories);
Book.belongsTo(Publisher);
Book.belongsTo(Format);
module.exports = Book;