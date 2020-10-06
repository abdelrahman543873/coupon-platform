import bcrypt from 'bcrypt'

function hashPass(password) {
    
    return bcrypt.hash(password, 10)
}

function bcryptCheckPass(userPassword, hashedPass) {
    return bcrypt.compare(userPassword, hashedPass)
}

export { hashPass, bcryptCheckPass }
