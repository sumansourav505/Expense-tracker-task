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
    },
    // userId:{
    //     type:DataTypes.INTEGER,
    //     allowNull:false,
    // }
});

module.exports=Expense;