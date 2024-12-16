const express = require('express');
//const bcrypt = require('bcrypt');
//const User = require('../models/user');
const Expense=require('../models/expense');
const router = express.Router();

//add a new Expense route
router.post('/expense',async(req,res)=>{
    const {amount,description,category,userId}=req.body;
    if(!amount||!description||!category||!userId){
        return res.status(400).json({message:'All fields are required'});
    }
    try{
        const expense=await Expense.create({amount, description, category, userId });
        res.status(201).json({ message: 'Expense added successfully.', expense });
    }catch(error){
        res.status(500).json({ message: 'Error saving expense. Try again later.' });
    }
})
//get all Expenses for user
router.get('/:userId',async(req,res)=>{
    const {userId}=req.params;
    try{
        const expenses=await Expense.findAll({where:{userId}});
        res.status(200).json(expenses);

    }catch(error){
        res.status(500).json({message:'error fetching..try again.'});
    }
})

// Update an existing expense
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, description, category, userId } = req.body;

    try {
        const expense = await Expense.findByPk(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        await expense.update({ amount, description, category, userId });
        res.status(200).json({ message: 'Expense updated successfully.', expense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Error updating expense. Try again later.' });
    }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findByPk(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense. Try again later.' });
    }
});
module.exports=router;