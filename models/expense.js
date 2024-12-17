const {DataTypes}=require('sequelize');
const sequelize=require('../config/database');

const Expense=sequelize.define('expenses',{
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

module.exports=Expense;