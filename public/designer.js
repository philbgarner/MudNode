(() => {
    const template = document.getElementById("template")
    const suggestions = document.getElementById("suggestions")

    var suggestion = {
        type: '',
        data: []
    }
    var showSuggestion = false

    const toggleSuggestions = (sugg) => {
        suggestion = sugg
        if (!showSuggestion) {
            let loc = getCaretLocation()
            loc.y += 16
            console.log(loc, suggestions.style)
            suggestions.style.left = (loc.x).toFixed(2) + 'px'
            suggestions.style.top = (loc.y).toFixed(2) + `px`
            suggestions.style.display = 'block'
            suggestions.innerHTML = `${suggestion.type}`
            showSuggestion = true
        } else {
            suggestion.type = ''
            suggestions.style.display = 'none'
            showSuggestion = false
        }
    }

    const getCaretLocation = () => {
        var x = 0;
        var y = 0;
        var sel = window.getSelection();
        if(sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            if(range.getClientRects()) {
            range.collapse(true);
            var rect = range.getClientRects()[0];
            if(rect) {
                y = rect.top;
                x = rect.left;
            }
            }
        }
        return {
            x: x,
            y: y
        };
    }

    const getCaretPosition = (element) => {
        var caretOffset = 0;
        
        if (window.getSelection) {
            var range = window.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        } 
        
        else if (document.selection && document.selection.type != "Control") {
            var textRange = document.selection.createRange();
            var preCaretTextRange = document.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        
        return caretOffset;
    }
    
    const setCaretPositionEnd = (contentEditableElement) => {
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        { 
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

    template.addEventListener('input', (e) => {
        console.log(e)
        if (e.data === '[') {
            //     let txt = n.data
            //     txt = txt.substring(0, txt.length - 1)
            //     n.data = txt
            // }
            // template.innerHTML = template.innerHTML.replace('<br>', '')
            // let newEl = document.createElement('span')
            // newEl.className = 'token_open'
            // newEl.innerHTML = '['
            // template.appendChild(newEl)
            // setCaretPositionEnd(template)
            toggleSuggestions({ type: 'Token Types.', data: ['*', '?'] })
        }
        console.log('>', template, template.innerHTML)
    });
})()