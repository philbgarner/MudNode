class User {
    constructor(uuid, username, password) {
        this.username = username
        this.password = password
        this.uuid = uuid
    }
}

module.exports.user = User
