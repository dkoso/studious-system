/*My Ticketing System*/

/**********************************************
*** Ticket Controller
**********************************************/
var ticketController = (function () {

    var storage = {
        id: [],
        date: [],
        name: [],
        office: [],
        email: [],
        trouble: []
    };

    return {

        getTickets: function () {
            return {
                id: storage.id[0],
                date: storage.date[0],
                name: storage.name[0],
                office: storage.office[0],
                email: storage.email[0],
                trouble: storage.trouble[0]
            };
        },

        setTickets: function (json) {
            this.clearTickets();
            storage.id.push(json._id);
            storage.date.push(json.date);
            storage.name.push(json.userName);
            storage.office.push(json.userOffice);
            storage.email.push(json.userEmail);
            storage.trouble.push(json.userTrouble);
        },

        clearTickets: function () {             ////////ClearArray//////////
            storage.id.length = 0;
            storage.date.length = 0;
            storage.name.length = 0;
            storage.office.length = 0;
            storage.email.length = 0;
            storage.trouble.length = 0;
        },

        dbFieldLength: function () {            // Count fields in storage for clear all in UI
            return Object.keys(storage).length;
        },

        testing: function () {
            console.log(storage.id[0]);
        }

    };

})();

/**********************************************
*** UI Controller
***********************************************/

var UIController = (function (ticketCtrl) {

    var DOMstrings = {
        line: 'line',  // Only clearing lines with for loop
        line0: 'line0',
        line1: 'line1',
        line2: 'line2',
        line3: 'line3',
        line4: 'line4',
        line5: 'line5',
        myForm: 'my-form',
        btnNew: 'subTickButton',
        showStatus: 'show-status',
        tickVal: 'tick-val',
        lineTest: 'linetest',
        ticketNum: 'tick-num',
        frame: 'frame',
        delete: 'delete',
        update: 'update',
        submitTick: 'submitDB',
        returnStatus: 'return-status',
        userName: 'userName',
        userOffice: 'userOffice',
        userEmail: 'userEmail',
        userTrouble: 'userTrouble'
    };

    // Sleep Function - Mix UI/Controller
    var sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    return {

        displayTickets: function () {
            document.getElementById(DOMstrings.line0).textContent = 'ID: ' + ticketCtrl.getTickets().id;
            document.getElementById(DOMstrings.line1).textContent = 'Date: ' + ticketCtrl.getTickets().date;
            document.getElementById(DOMstrings.line2).textContent = 'Name: ' + ticketCtrl.getTickets().name;
            document.getElementById(DOMstrings.line3).textContent = 'Office: ' + ticketCtrl.getTickets().office;
            document.getElementById(DOMstrings.line4).textContent = 'e-mail: ' + ticketCtrl.getTickets().email;
            document.getElementById(DOMstrings.line5).textContent = 'Trouble: ' + ticketCtrl.getTickets().trouble;
        },

        showMsgStatus: async function (typeMsg) {
            if (typeMsg === 'saved') {
                document.getElementById(DOMstrings.showStatus).textContent = 'Saved';
                this.clearSubmitForm();
                console.log('Submit');
            } else if (typeMsg === 'deleted') {
                document.getElementById(DOMstrings.showStatus).textContent = 'Deleted';
                console.log('Deleted');
            } else if (typeMsg === 'updated') {
                document.getElementById(DOMstrings.showStatus).textContent = 'Updated';
                console.log('Updated');

            }
            await sleep(3000);
            document.getElementById(DOMstrings.showStatus).textContent = '';
        },

        showReturnStatus: function (result) {
            document.getElementById(DOMstrings.returnStatus).textContent = result;
        },

        clearReturnStatus: function () {
            document.getElementById(DOMstrings.returnStatus).textContent = '';

        },

        // Clear Form Left Box - UI
        clearSubmitForm: function () {
            document.getElementById(DOMstrings.myForm).reset();
        },

        // Clear All Right Box Fields
        clearAllRight: function () {
            for (var i = 0; i < ticketCtrl.dbFieldLength(); i++) {
                document.getElementById(DOMstrings.line + i).textContent = '';
            }
            document.getElementById(DOMstrings.lineTest).textContent = '';
            document.getElementById(DOMstrings.tickVal).value = '';
            this.clearTicketNum();
            this.clearReturnStatus()
        },

        // Get ticket Database ID from UI
        getTicketInput: function () {
            return document.getElementById(DOMstrings.tickVal).value;
        },

        setTicketInput: function (val) {
            document.getElementById(DOMstrings.tickVal).value = val;
        },

        clearTicketInput: function () {
            document.getElementById(DOMstrings.tickVal).value = '';
        },

        setTicketNum: function (num) {
            document.getElementById(DOMstrings.ticketNum).textContent = 'Ticket: ' + num;
        },

        clearTicketNum: function () {
            document.getElementById(DOMstrings.ticketNum).textContent = '';
        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        // Get Updated Form Fields For Put - Update
        getUpdateFields: function () {
            return {
                userName: document.getElementById(DOMstrings.userName).value,
                userOffice: document.getElementById(DOMstrings.userOffice).value,
                userEmail: document.getElementById(DOMstrings.userEmail).value,
                userTrouble: document.getElementById(DOMstrings.userTrouble).value
            };
        },

        // Push raw JSON text up to the UI
        rawTestJson: function (txt) {
            document.getElementById(DOMstrings.lineTest).textContent = txt;
        }

    };

})(ticketController);

/**********************************************
*** Global App Controller
**********************************************/

var controller = (function (ticketCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings();

    ///////////Submit Form Start////////////////////////

    $("#my-form").submit(function (event) {
        event.preventDefault(); //prevent default action 
        var post_url = $(this).attr("action"); //get form action url
        var form_data = $(this).serialize(); //Encode form elements for submission
        $.post(post_url, form_data, function (response) {
            $("#server-results").html(response);
            processSubmit(response);
            UICtrl.showMsgStatus('saved');
        });
    });

    //Process Response
    var processSubmit = function (response) {
        var display = response["userName"] + ' - ' + response["_id"];
        UICtrl.showReturnStatus(display);
    }

    ///////////////Submit Form End/////////////////////

    // Get ticket in ID and format it
    var addressGetTicket = function (type) {
        var ticketIn = UICtrl.getTicketInput();
        if (ticketIn === '' && type === 'specific') {
            alert('Please enter a valid Ticket ID!');
            //return 'http://192.168.2.60:3000/users/5b142ef7a6953904f351641e'; // A DB Entry Just To Display Invalid Ticket In Trouble Field
            return 'http://192.168.2.60:3000/users/123'
        } else if (ticketIn === '') {
            alert('Please enter a valid Ticket ID!');
            return 'http://192.168.2.60:3000/users/123'
        } else {
            return 'http://192.168.2.60:3000/users/' + ticketIn;
        }
    };

    // Take specific ticket ID and put it into ticket controller data structure
    $('#get').click(function () {
        $.get(addressGetTicket('specific'), function (data, status) {
            var thing = data;
            // console.log(thing);
            ticketCtrl.setTickets(thing);
            UICtrl.displayTickets();
            UICtrl.clearTicketNum();
        })
    })

    // Get Last Ticket Submitted 
    $('#last').click(function () {
        $.get('http://192.168.2.60:3000/users', function (data, status) {
            var k;
            k = data.length - 1;
            var thing = data[k];
            UICtrl.setTicketNum(k);
            console.log(k);
            ticketCtrl.setTickets(thing);
            UICtrl.displayTickets();
            setTicketIDField();
            j = k;
        })
    })

    // Index Counter For Up/Down
    var j = 0;
    state = false;

    // Up Ticket
    $('#get-all-up').click(function () {
        $.get('http://192.168.2.60:3000/users', function (data, status) {
            if (j < data.length - 1 && state === true) {
                j++;
            }
            var thing = data[j];
            UICtrl.setTicketNum(j);
            console.log(j);
            // console.log(thing);
            ticketCtrl.setTickets(thing);
            UICtrl.displayTickets();
            setTicketIDField();
            state = true;
        })
    })

    // Down Ticket
    $('#get-all-down').click(function () {
        $.get('http://192.168.2.60:3000/users', function (data, status) {
            if (j > 0) {
                j--;
            }
            state = true;
            var thing = data[j];
            UICtrl.setTicketNum(j);
            console.log(j);
            // console.log(thing);
            ticketCtrl.setTickets(thing);
            UICtrl.displayTickets();
            setTicketIDField();
        })
    })

    // Update Ticket - Confirm Box
    var submitUpdate = function () {
        var accept = confirm('Are you sure you want to UPDATE?');
        if (accept === true) {
            var data = UICtrl.getUpdateFields();
            $.ajax({
                url: addressGetTicket('update'),
                type: 'PUT',
                data: data,
                success: function (result) {
                    // UICtrl.showReturnStatus(result);
                    // console.log(result);
                    UICtrl.showMsgStatus('updated');
                    UICtrl.clearTicketInput();
                }
            });
        } else {
            console.log('Cancelled');
        }
    }

    // Delete Ticket - Confirm Box
    var submitDelete = function () {
        var accept = confirm('Are you sure you want to DELETE?');
        if (accept === true) {
            $.ajax({
                url: addressGetTicket('delete'),
                type: 'DELETE',
                success: function (result) {
                    UICtrl.showReturnStatus(result);
                    // console.log(result);
                    UICtrl.showMsgStatus('deleted');
                    UICtrl.clearTicketInput();
                }
            });
        } else {
            console.log('Cancelled');
        }
    }

    // Event Listeners
    var setupEventListeners = function () {
        // document.getElementById(DOM.btnNew).addEventListener("click", submitSave); //When Submit is moved out of <Form></Form>
        document.getElementById(DOM.delete).addEventListener("click", submitDelete);
        document.getElementById(DOM.update).addEventListener("click", submitUpdate);
    }

    // Populate Ticket ID Value When Going Up Down
    var setTicketIDField = function () {
        // UICtrl.setTicketInput(data[j]['_id']);
        UICtrl.setTicketInput(ticketCtrl.getTickets().id);
    }

    // Clear All Tickets Right Box
    $('#clear-all').click(function () {
        UICtrl.clearAllRight();
    })

    // Test Displays Raw JSON - Not Permament
    $('#test').click(function () {
        $.get('http://192.168.2.60:3000/users', function (data, status) {
            var rawTestText = JSON.stringify(data)
            UICtrl.rawTestJson(rawTestText);
            // console.log(status);
        })
    })

    // Initialize App
    return {
        init: function () {
            console.log('Application has started...');
            setupEventListeners();
        }
    };

})(ticketController, UIController);

controller.init();


