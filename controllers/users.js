const User = require('../models/user');
const passport = require('passport');

module.exports.registerForm = (req,res) =>{
    res.render('users/register');
}

module.exports.registerUser =async (req,res,next) =>{
    try {
        const { email, username, password} = req.body;
        const user = new User({ email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to Doma');
            res.redirect('/services');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginForm  = (req,res) => {
    res.render('users/login');
}

module.exports.login = async (req,res) =>{    
    req.flash('success', 'welcome back!')
    res.redirect('/services');
}

module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/services');
    });
}