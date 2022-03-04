let users = {}
let map = new Map();

const getUsers = () => {
    return users
}

const getUser = (username) => {
    for (let u in users) {
        if (users[u].username === username) {
            return users[u]
        }
    }
    return null
}

const addUser = (user) => {
    users[user.uuid] = user
}

const loadUsers = (buffer) => {
    users = JSON.parse(buffer.toString())
}

const setUserWs = (userId, ws) => {
    map.set(userId, ws);
}

const getUserWs = (userId) => {
    return map.get(userId)
}

const deleteUserWs = (userId) => {
    map.delete(userId);
}

const getUserWsList = () => {
    return map
}

export { getUsers, getUser, addUser, loadUsers, setUserWs, getUserWs, deleteUserWs, getUserWsList }
export default { getUsers: getUsers, getUser: getUser, loadUsers: loadUsers, setUserWs: setUserWs, getUserWs: getUserWs, deleteUserWs: deleteUserWs, getUserWsList: getUserWsList }