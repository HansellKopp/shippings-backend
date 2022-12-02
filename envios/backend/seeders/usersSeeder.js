const bcrypt = require('bcrypt')
const User = require('../models/User')

const users = [
    {
        "username": "hansellkopp",
        "password": "pass",
        "roles": ["Employee", "Admin"]
    }
    ]


seedUsers = () => {
    users.forEach(async (user)=> {
        const { username, password, roles } = user

        const duplicate = await User.findOne({ username }).lean().exec()
    
        if (duplicate) {
            return;
        }
            
        // Hash password 
        const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    
        const userObject = { username, "password": hashedPwd, roles }

        const created = await User.create(userObject)
        
        console.log(`User ${username} created`)
    })
}

module.exports = {
    seedUsers
}