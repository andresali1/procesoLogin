const fs = require('fs');
const bcryptjs = require('bcryptjs');

const usersModel = {
    filename: './src/model/users.json',

    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    },

    generateId: function() {
        let allUsers = this.findAll();
        let newId = 0;
        allUsers.forEach(user => {
            if(user.id > newId){
                newId = user.id
            }            
        });
        return newId + 1;
    },

    findAll: function () {
        return this.getData();
    },

    findByPk: function (id) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser.id == id);
        return userFound;
    },

    findByField: function (field, text) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser[field] == text);
        return userFound;
    },

    create: function (userData, fileName) {
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateId(),
            ...userData,
            password: bcryptjs.hashSync(userData.password, 10),
            avatar: fileName
        }
        allUsers.push(newUser);
        fs.writeFileSync(this.filename, JSON.stringify(allUsers, null, ' '));
        return newUser;
    },

    delete: function(id) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id != id);
        fs.writeFileSync(this.filename, JSON.stringify(finalUsers, null, ' '));
        return true;
    }
};

module.exports = usersModel;

// console.log(usersModel.create({
//     name: "Leia Skywalker",
//     email: "leia@alliance.org",
//     password: "viejacaliente",
//     country: "Coursant",
//     avatar: "default.jpg"
// }));