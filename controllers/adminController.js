const users = require('../models/userModel')
const category = require('../models/categoryModel')
const productModel = require('../models/productModel')


const session = require('express-session')
const bcrypt = require('bcrypt')
const { ClientSession } = require('mongodb')






// GET ADMIN PANEL - get /admin
// ---------------------------------------------------------------------------------
const getAdminPanel = async (req, res) => {
    try {
        res.render('admin-panel')
        
            }catch(error){
                console.log(error);
            }
        }
        


// GET LOGIN  - get /admin/login
// ---------------------------------------------------------------------------------
const getLogin = async (req, res) => {
    try {

        res.render('login')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------




// POST LOGIN    - To verify Admin credentials
// ---------------------------------------------------------------------------------
const postLogin = async (req, res) => {
    try {
        const emailEntered = req.body.email
        const passwordEntered = req.body.password
        const adminDb = await users.findOne({ email: emailEntered })

        if (adminDb) {
            const matchPassword = await bcrypt.compare(passwordEntered, adminDb.password)
            if (matchPassword) {
                if (adminDb.is_admin === 0) {
                    res.render('login', { message: 'You are not ADMIN' })
                }
                else {
                    req.session.admin_id = adminDb._id
                    res.redirect('/admin')
                }
            }
            else {
                res.render('login', { message: 'Entered password is wrong' })
            }
        }
        else {
            res.render('login', { message: 'Entered email ID is wrong' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
// ---------------------------------------------------------------------------------



// GET LOGOUT - session destroy
// ---------------------------------------------------------------------------------
const getLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin/login'); // Redirect to the login page after logout
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
// ---------------------------------------------------------------------------------




// GET USER MANAGEMENT - /admin/users
// ---------------------------------------------------------------------------------
const getUserManagement = async (req, res) => {
    try {
        const userDatas = await users.find({ $and: [{ is_verified: 1 }, { is_admin: 0 }] })
        res.render('users', { message: userDatas })
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------




// TO BLOCK USER - /admin/users/block
// ---------------------------------------------------------------------------------
const blockUser = async (req, res) => {
    try {
        const id = req.query.id
        await users.updateOne({ _id: id }, { $set: { is_block: 1 } })
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------




// TO un BLOCK USER - /admin/users/block
// ---------------------------------------------------------------------------------
const unBlockUser = async (req, res) => {
    try {
        const id = req.query.id
        await users.updateOne({ _id: id }, { $set: { is_block: 0 } })
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------



// GET CATEGORY PAGE - /admin/categories
// ---------------------------------------------------------------------------------
const getCategory = async (req, res) => {
    try {
        const categoryDatas = await category.find()
        res.render('category', { message: categoryDatas })
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------



// GET ADD CATEGORY PAGE - /admin/categories/add
// ---------------------------------------------------------------------------------
const getAddCategoryPage = async (req, res) => {
    try {
        res.render('add-category')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------



// POST - ADD CATEGORY TO DB 
// ---------------------------------------------------------------------------------
const addCategory = async (req, res) => {
    try {
        const newCategory = req.body.category
        if (newCategory.trim().length == 0) {
            res.render('add-category', { message: 'Enter category name' })
        }
        const categoryExists = await category.findOne({ name: new RegExp('^' + newCategory + '$', 'i') })

        if (categoryExists) {
            res.render('add-category', { message: 'Category already registered' })
        }
        else {
            const categoryData = new category({
                name: req.body.category,
                is_block: 0
            })
            const categoryDoc = await categoryData.save()
            res.redirect('/admin/category')
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
// ---------------------------------------------------------------------------------



// TO BLOCK A CATEGORY 
// ---------------------------------------------------------------------------------
const blockCategory = async (req, res) => {
    try {
        const id = req.query.id
        await category.updateOne({ _id: id }, { $set: { is_block: 1 } })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------



// TO UN BLOCK A CATEGORY
// ---------------------------------------------------------------------------------
const unBlockCategory = async (req, res) => {
    try {
        const id = req.query.id
        await category.updateOne({ _id: id }, { $set: { is_block: 0 } })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
    }
}
// ---------------------------------------------------------------------------------



module.exports = {
    getAdminPanel,
    getLogin,
    postLogin,
    getLogout,
    getUserManagement,
    unBlockUser,
    getCategory,
    getAddCategoryPage,
    addCategory,
    blockCategory,
    unBlockCategory,
    blockUser
}
    