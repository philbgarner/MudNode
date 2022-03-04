const welcomeMessage = (ws) => {
    ws.send("\n\r=============================================================================")
    ws.send("Welcome to ws-mud!")
    ws.send("This is an experiment in making a web sockets, browser based node implementation of a M.U.D. system.")
    ws.send("TODO: Move this to an external config so it's easily updatable, make a command to modify in-game.")
    ws.send("\n\r")
}

export default { welcomeMessage }
