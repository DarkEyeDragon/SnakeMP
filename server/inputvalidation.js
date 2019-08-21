class InputValidation{
    static isValidUsername(username){
        return username.length > 3 && username.length <= 16;
    }
}
module.exports = InputValidation;