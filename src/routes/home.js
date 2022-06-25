const express = require('express');
const router = express.Router();
const path = require('path');
const { navigationController } = require('../controller')
const multer = require('multer');
const { body } = require('express-validator');
const guestMiddleware = require('../middleware/guestMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img/users'))
    },
    filename: (req, file, cb) => {
        const fileName = file.fieldname + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

const validations = [
    body('name')
        .notEmpty().withMessage('Escribe tu nombre'),
    body('email')
        .notEmpty().withMessage('Escribe tu correo')
        .isEmail().withMessage('Escribe un email válido'),
    body('password')
        .notEmpty().withMessage('Digita una contraseña'),
    body('country')
        .notEmpty().withMessage('Selecciona una opción')
];


router.get('/', navigationController.getHome)

//Proceso de Login
router.get('/login', guestMiddleware, navigationController.getLogin)
router.post('/login', navigationController.loginProccess)

//Proceso de register
router.get('/register', guestMiddleware, navigationController.getRegister)
router.post('/register', upload.single('avatar'), validations, navigationController.createUser)

//Perfil de usuario
router.get('/userProfile', authMiddleware, navigationController.userProfile)

//Logout usuario
router.get('/logout', navigationController.logout)

module.exports = router;