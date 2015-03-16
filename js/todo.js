/**
 * Created by ap on 16.03.2015.
 */

// get data from local storage or create an empty array
var todoTasks = (localStorage.todoTasks == undefined ? []: JSON.parse(localStorage.todoTasks))


$(function () {

    // Add Listener on add button
    $("#todo-addbutton").click( function () {
        var entry = $("#todo-input")
        var entryName = entry.val()
        entry.val('')
        // Task name is not empty
        if (entryName.length > 0) {

            //Check if task already exists
            var alreadyExists = todoTasks.some(function (curr) {
                return curr.title == entryName
            })

            if (alreadyExists) {
                showAlreadyExistsAlert()
            } else {
                var task = {title: entryName, done: false, time: Date.now()}
                todoTasks.unshift(task)
                updateLocalStorage()
                var template = todoTemplate(task)
                $("#unDoneTasksContainer").prepend(template)
                template.slideDown(300)
            }
        }
    })


    $("#templ_todoEntry").mouseenter(function(){
        $(".taskControls", this).show()
    }).mouseleave(function(){
        $(".taskControls", this).hide()
    })

    $(".buttonDeleteTask").click(function(){
        var domNode = $(this).parent().parent()
        var name = $(".entryTitle", domNode).text()

        for(var i=0; i< todoTasks.length; i++){
            if (todoTasks[i].title == name) {
                todoTasks.splice(i--, 1);
            }
        }
        updateLocalStorage()

        domNode.slideUp(300, function(){
            this.remove()
        })

    })

    $(".buttonDoTask").click(function(){
        var domNode = $(this).parent().parent()
        var name = $(".entryTitle", domNode).text()
        var isDone = false
        for(var i=0; i< todoTasks.length; i++){
            if (todoTasks[i].title == name) {
                todoTasks[i].done = !todoTasks[i].done
                isDone = todoTasks[i].done
                //move element to the top
                todoTasks.unshift( todoTasks.splice(i, 1)[0]);
                break;
            }
        }
        updateLocalStorage()

        domNode.slideUp(300, function(){

            domNode.detach()
            if(isDone)
                $("#doneTasksContainer").prepend(domNode.addClass('doneTask'))
            else
                $("#unDoneTasksContainer").prepend(domNode.removeClass('doneTask'))

            domNode.slideDown(300)
        })

    })


    //render existing tasks
    todoTasks.forEach(function(elem){
        var domNode = todoTemplate(elem)
        if(elem.done)
            $("#doneTasksContainer").append(domNode)
        else
            $("#unDoneTasksContainer").append(domNode)

        domNode.fadeIn(300)
    })

})


function todoTemplate(entry){
    //find and clone the template node
    var newNode = $( "#templ_todoEntry" ).clone(true)
    var time = new Date(entry.time)
    var timeString = addZero(time.getHours()) + ':' +  addZero(time.getMinutes())
    if(entry.done) newNode.addClass('doneTask')
    $('#placeholder_title', newNode).text(entry.title).removeClass('placeholder').removeAttr('id')
    $('#placeholder_time', newNode).text(timeString).removeClass('placeholder').removeAttr('id')
    return newNode.removeAttr('id')
}

function updateLocalStorage(){
    localStorage.todoTasks = JSON.stringify(todoTasks)
}


function alertManager(){
    var showingAlert = false
    // closure to store internal function execution state
    return function() {
        if(!showingAlert) {
            showingAlert = true
            $("#alertdiv").slideDown()

            setTimeout(function () { // this will automatically close the alert in 4 secs
                $("#alertdiv").slideUp(400, function(){
                    showingAlert = false
                })
            }, 4000);
        }
    }
}

var showAlreadyExistsAlert = alertManager()

function addZero(num) {
    return num.toString().length == 1 ? '0'+num : num
}