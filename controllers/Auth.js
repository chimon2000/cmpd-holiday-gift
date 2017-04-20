var passport = require('passport');

module.exports = {
    // Authentication Verification
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    },

    login: {
        get: function(req, res) {
            res.renderData('login', 'Login', { message: 'This is the Login page' });
        },
        post: passport.authenticate('local-signin', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    },

    register: {
        get: function(req, res) {
            res.renderData('register', 'Register', { message: 'This is the registration page' });
        },
        post: passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/register'
        })
    },

    logout: function(req, res) {
        req.session.destroy(function() {
            res.redirect('/login');
        });
    }
};

