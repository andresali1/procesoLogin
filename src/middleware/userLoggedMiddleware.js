const usersModel = require('../model/usersModel');

function userLoggedMiddleware(req, res, next) {
    res.locals.isLogged = false;
    let emailInCookie = req.cookies.userEmail;
    let userFromCookie = usersModel.findByField('email', emailInCookie);

    if(userFromCookie) {
        req.session.userLogged = userFromCookie;
    }

    if(req.session.userLogged) {
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged;
    }    
    next();
};

module.exports = userLoggedMiddleware;