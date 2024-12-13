const Sequelize=require('sequelize');
const sequelize=new Sequelize('expense-tracker','root','Chintu5050@',{
    host:'localhost',
    dialect:'mysql',
});

module.exports=sequelize;