let users = {}
let map = new Map();

module.exports.users = function () {
    return users
}

module.exports.getUser = function (username) {
    for (let u in users) {
        if (users[u].username === username) {
            return users[u]
        }
    }
    return null
}

module.exports.addUser = function (user) {
    users[user.uuid] = user
}

module.exports.loadUsers = function (buffer) {
    users = JSON.parse(buffer.toString())
}

module.exports.setUserWs = function (userId, ws) {
    map.set(userId, ws);
}

module.exports.getUserWs = function (userId) {
    return map.get(userId)
}

module.exports.deleteUserWs = function (userId) {
    map.delete(userId);
}

module.exports.getUserWsList = function () {
    return map
}