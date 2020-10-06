import mongoose from 'mongoose'

function checkMongooseId(value, helper){
    try {
        let check = value == new mongoose.Types.ObjectId(value)
            ? true : false

        if (!check) {
            return helper.error('any.invalid')
        }
        return value
    } catch (err) {
        return helper.error('any.invalid')
    }
}

export { checkMongooseId }
