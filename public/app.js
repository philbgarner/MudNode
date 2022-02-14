(function () {
    const messages = document.querySelector('#messages')
    const wsButton = document.querySelector('#wsButton')
    const wsSendButton = document.querySelector('#wsSendButton')
    //const logout = document.querySelector('#logout')
    const login = document.querySelector('#login')
    const command = document.querySelector('#command')
    const register = document.getElementById('btnRegister')
    const showregister = document.getElementById('showregister')

    const loginPanel = document.querySelector('#loginpanel')
    const registerPanel = document.getElementById('registerpanel')

    const username = document.querySelector('#username')
    const password = document.getElementById('passw')
    const regusername = document.querySelector('#regusername')
    const regpassword = document.getElementById('regpassw')

    const miniMap = document.getElementById('minimap')

    function toggleLoginPanel() {
      if (loginPanel.classList.contains('showlogin')) {
        loginPanel.classList.remove('showlogin')
      } else {
        loginPanel.classList.add('showlogin')
      }
    }

    function toggleMinimap() {
      if (miniMap.classList.contains('showmap')) {
        miniMap.classList.remove('showmap')
      } else {
        miniMap.classList.add('showmap')
      }
    }

    function toggleRegisterPanel() {
      if (registerPanel.classList.contains('showregister')) {
        registerPanel.classList.remove('showregister')
      } else {
        registerPanel.classList.add('showregister')
      }
    }
  
    function showMessage(response) {
      messages.textContent += `\n${response.message}`
      messages.scrollTop = messages.scrollHeight
    }

    showregister.onclick = function () {
      toggleLoginPanel()
      toggleRegisterPanel()
    }

    register.onclick = function () {
      fetch('/register', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username: regusername.value, password: regpassword.value })})
      .then(function (res) {
        if (res.ok) {
          toggleRegisterPanel()
          toggleLoginPanel()
          return res.json()
        }
      }).then(showMessage)
      .catch(function (err) {
        showMessage(err.message)
      })
    }

    login.onclick = function () {
        fetch('/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username: username.value, password: password.value }) })
        .then(function (res) {
          if (res.ok) {
            toggleLoginPanel()
            return res.json()
          }
          else {
            return {ok: false, message: 'Login failed: username or password is incorrect.'}
          }
        })
        .then(showMessage)
        .then(webSocketConnect)
        .catch(function (err) {
          showMessage(err.message)
        })
    }
  
    // logout.onclick = function () {
    //   fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
    //     .then(handleResponse)
    //     .then(showMessage)
    //     .catch(function (err) {
    //       showMessage(err.message)
    //     })
    // }
  
    let ws
  
    function webSocketConnect () {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null
        ws.close()
      }
  
      ws = new WebSocket(`ws://${location.host}`)
      ws.onerror = function () {
        showMessage({ok: false, message: 'WebSocket error'})
      }
      ws.onopen = function () {
        showMessage({ok: true, message: 'WebSocket connection established'})
      }
      ws.onclose = function () {
        showMessage({ok: true, message: 'WebSocket connection closed'})
        ws = null
      }
      ws.onmessage = function (e) {
        showMessage({ok: true, message: e.data})
      }
    }
  
    wsSendButton.onclick = function () {
      if (!ws) {
        showMessage({ok: false, message: 'No WebSocket connection'})
        return
      }
  
      ws.send(command.value)
      command.value = ''
    }

    command.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') {
        if (!ws) {
          showMessage({ok: false, message: 'No WebSocket connection'})
          return
        }

        ws.send(command.value)
        command.value = ''
      }
    })

    toggleLoginPanel()
    //toggleMinimap()

  })()
  