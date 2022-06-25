const fs = require('fs');
const path = require('path');
const usersModel = require('../model/usersModel');
const bcryptjs = require('bcryptjs');

const { validationResult } = require('express-validator');

const navigationController = {
    getHome: (req, res, next) => {
        res.render('index', { title: "Fran Generator" })
    },
    getLogin: (req, res, next) => {
        res.render('login', { title: "Login" })
    },
    loginProccess: (req, res) => {
        let userToLogin = usersModel.findByField('email', req.body.email);
        if (userToLogin) {
            let correctPassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
            if (correctPassword) {
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                if(req.body.remember){
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
                };
                return res.redirect('/userProfile');
            }
        }
        return res.render('login', {
            errors: {
                email: {
                    msg: 'Error en autenticación'
                }
            }
        })

    },
    getRegister: (req, res, next) => {
        res.render('register', { title: "Registro" })
    },
    createUser: function (req, res) {
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            return res.render('register', {
                errors: resultValidation.mapped(),
                oldData: req.body
            });
        } else {
            let userInData = usersModel.findByField('email', req.body.email);

            if (userInData) {
                return res.render('register', {
                    errors: {
                        email: {
                            msg: 'Este email ya está registrado'
                        }
                    },
                    oldData: req.body
                });
            } else {
                usersModel.create(req.body, req.file.filename);
                res.redirect('/');
            }
        }
    },
    userProfile: (req, res) => {
        res.render('userProfile', { user: req.session.userLogged });
    },
    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        res.redirect('/')
    }
}

module.exports = navigationController;