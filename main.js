//Misc.

//read in data from LocalStorage when loaded
function pageLoaded() {
    //check if there is enough computing power
    var test = testCompPower();
    if (test) {
        //yay!
    } else {
        //Sorry! No support!
        alert("Sorry, Not enought computational power!");
        window.close();
    }
    //check if LocalStorage is supported
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
    } else {
        // Sorry! No Web Storage support..
    }

    //check and load stored message

    //check and load stored keys

    //update buttons and validate keys
    validateKeys(true, true);

}

//ask user before leaving
/*
window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. ' +
        'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});
*/

// Key Manager

//generate user keypair
var userKeyPair = new RSAKey(true);
var RSAmessage = "";
var friendsKeyPair = new RSAKey(false);
// var YourN = yourKeypair.n;
// var YourD = yourKeypair.d;
// var YourE = yourKeypair.e;
// var friendsN = friendsKeyPair.n;
// var friendsE = friendsKeyPair.e;
function generateUserKeypair() {
    console.log("Generating user keypair...");
    displayKeys();
    userKeyPair = new RSAKey(true);
}

//save user keypair
function saveUserKeypair(silent) {
    if (userKeyPair == undefined) { userKeyPair.generateKeys();}
    if (validateYourKeysSilent()) {
        userKeyPair.importPrivate(parseInt(document.getElementById('YourKeyD').value), parseInt(document.getElementById('YourKeyN').value));
        userKeyPair.importPublic(parseInt(document.getElementById('YourKeyE').value), parseInt(document.getElementById('YourKeyN2').value));
        if (!silent) {
            alert("User's keys imported.");
        }
    }
    
    validateKeys(false, silent);
}

//save friends keypair
function saveFriendsKeypair(silent) {
    if (validateFriendsKeysSilent()) {
        friendsKeyPair.importPublic(parseInt(document.getElementById('FriendsKeyE').value), parseInt(document.getElementById('FriendsKeyN').value));
        if (!silent) {
            alert("Friend's keys imported.");
        }
    }
    validateKeys(true, silent);
}

//check for valid keys
function validateKeys(friendsToo, silent) {
    if (!friendsToo) {
        //validate your keys
        if ((userKeyPair.n == "") || !(isNumeric(userKeyPair.n)) || (userKeyPair.e == "") || !(isNumeric(userKeyPair.e)) || (userKeyPair.d == "") || !(isNumeric(userKeyPair.d))) {
            if (!silent) {
                alert('Invalid User Keys, Please import or generate valid ones.');
            }
        }
    } else {
        //validate friend's keys
        if ((friendsKeyPair.n == "") || (friendsKeyPair.n == undefined) || !(isNumeric(friendsKeyPair.n)) || (friendsKeyPair.e == "") || (friendsKeyPair.e == undefined) || !(isNumeric(friendsKeyPair.e))) {
            if (!silent) {
                alert('Invalid Target Keys, Please import valid ones.');
            }
        }
    }

    //update buttons
    for (var i = 0; i < document.getElementsByClassName('cryptButton').length; i++) {
        document.getElementsByClassName('cryptButton')[i].disabled = !validateKeysSilent();
    }
}

function validateKeysSilent() {
    if ((userKeyPair.n == "") || !(isNumeric(userKeyPair.n)) || (userKeyPair.e == "") || !(isNumeric(userKeyPair.e)) || (userKeyPair.d == "") || !(isNumeric(userKeyPair.d))) {
        return false;
    }
    if ((friendsKeyPair.n == "") || (friendsKeyPair.n == undefined) || !(isNumeric(friendsKeyPair.n)) || (friendsKeyPair.e == "") || (friendsKeyPair.e == undefined) || !(isNumeric(friendsKeyPair.e))) {
        return false;
    }
    return true;
}

function validateYourKeysSilent() {
    //update buttons
    for (var i = 0; i < document.getElementsByClassName('cryptButton').length; i++) {
        document.getElementsByClassName('cryptButton')[i].disabled = !validateKeysSilent();
    }
    if ((document.getElementById('YourKeyN').value == "") || !(isNumeric(document.getElementById('YourKeyN').value)) || (document.getElementById('YourKeyE').value == "") || !(isNumeric(document.getElementById('YourKeyE').value)) || (document.getElementById('YourKeyD').value == "") || !(isNumeric(document.getElementById('YourKeyD').value))) {
        document.getElementById('YourKeyN').style.color = "red";
        document.getElementById('YourKeyN2').style.color = "red";
        document.getElementById('YourKeyE').style.color = "red";
        document.getElementById('YourKeyD').style.color = "red";
        return false;
    }
    document.getElementById('YourKeyN').style.color = "#393f4b";
    document.getElementById('YourKeyN2').style.color = "#393f4b";
        document.getElementById('YourKeyE').style.color = "#393f4b";
        document.getElementById('YourKeyD').style.color = "#393f4b";
    return true;
}

function validateFriendsKeysSilent() {
    //update buttons
    for (var i = 0; i < document.getElementsByClassName('cryptButton').length; i++) {
        document.getElementsByClassName('cryptButton')[i].disabled = !validateKeysSilent();
    }
    if ((document.getElementById('FriendsKeyN').value == "") || (document.getElementById('FriendsKeyN').value == undefined) || !(isNumeric(document.getElementById('FriendsKeyN').value)) || (document.getElementById('FriendsKeyE').value == "") || (document.getElementById('FriendsKeyE').value == undefined) || !(isNumeric(document.getElementById('FriendsKeyE').value))) {
        return false;
        document.getElementById('FriendsKeyN').style.color = "red";
        document.getElementById('FriendsKeyE').style.color = "red";
    }
    document.getElementById('FriendsKeyN').style.color = "#393f4b";
        document.getElementById('FriendsKeyE').style.color = "#393f4b";
    return true;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//display keys
function displayKeys() {
    document.getElementById('YourKeyN').value = userKeyPair.n;
    document.getElementById('YourKeyD').value = userKeyPair.d;
    document.getElementById('YourKeyE').value = userKeyPair.e;
    document.getElementById('YourKeyN2').value = userKeyPair.n;

    if ((friendsKeyPair.n || friendsKeyPair.e) != undefined) {
        document.getElementById('FriendsKeyN').value = friendsKeyPair.n;
        document.getElementById('FriendsKeyE').value = friendsKeyPair.e;
    }
}


//Message
var fileOut = "";

//download Message
function downloadMessage() {
    downloadFile("RSA-message.txt", text);
}

//upload message
function loadMessage(fileReady) {
    if (!fileReady) {
        //read file and call again after done
        readFile("message");
    } else {
        //file is read, load It
        console.log("Message Loaded:");
        console.log(fileOut);
    }
}

//download desk
function downloadDesk() {
    downloadFile("RSA-desk.json", JSONtext);
}

//upload desk
function loadDesk(fileReady) {
    if (!fileReady) {
        //read file and call again after done
        readFile("desk");
    } else {
        //file is read, load It
        console.log("Desk Loaded:");
        console.log(fileOut);
    }
}

//read file
function readFile(callback) {
    var input = document.getElementById("myFile");
    input.click();
    input.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            var myFile = this.files[0];
            var reader = new FileReader();

            if (callback == "message") {
                reader.addEventListener('load', function (e) {
                    fileOut = e.target.result;
                    loadMessage(true);
                });
            } else if (callback == "desk") {
                reader.addEventListener('load', function (e) {
                    fileOut = e.target.result;
                    loadDesk(true);
                });
            }

            reader.readAsBinaryString(myFile);
        }
    });
}

//download file
function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}




//get message/keys
function getParameters() {

}

//put message/keys
function setParameters() {

}


//Encrypt

//encrypt with friends public
function encryptFriendsPublic() {
    var message = document.getElementById("messageArea").value;
    friendsKeyPair.setType("public");
    message = RSA.encryptWithKey(message, friendsKeyPair);
    document.getElementById("messageArea").value = message;
}

//encrypt with friends public then encrypt with your private
function encryptSigned() {
    var message = document.getElementById("messageArea").value;
    friendsKeyPair.setType("public");
    message = RSA.encryptWithKey(message, friendsKeyPair);
    userKeyPair.setType("private");
    message = RSA.encryptWithKey(message, userKeyPair);
    document.getElementById("messageArea").value = message;
}

//-----
//encrypt with your public
function encryptWithYourPublic() {
    var message = document.getElementById("messageArea").value;
    yourKeyPair.setType("public");
    message = RSA.encryptWithKey(message, yourKeyPair);
    document.getElementById("messageArea").value = message;
}

//encrypt with your private
function encryptWithYourPrivate() {
    var message = document.getElementById("messageArea").value;
    yourKeyPair.setType("private");
    message = RSA.encryptWithKey(message, yourKeyPair);
    document.getElementById("messageArea").value = message;
}

//encrypt with friends public
function encryptWithFriendsPublic() {
    encryptFriendsPublic();
}

//Decrypt

//decrypt with your private
function decryptMyPrivate() {
    var message = document.getElementById("messageArea").value;
    userKeyPair.setType("private");
    message = RSA.decryptWithKey(message, userKeyPair);
    document.getElementById("messageArea").value = message;
}

//decrypt with friends public then your private
function decryptSigned() {
    var message = document.getElementById("messageArea").value;
    friendsKeyPair.setType("public");
    message = RSA.decryptWithKey(message, friendsKeyPair);
    userKeyPair.setType("private");
    message = RSA.decryptWithKey(message, userKeyPair);
    document.getElementById("messageArea").value = message;
}

//--------
//decrypt with your public
function decryptWithYourPublic() {
    var message = document.getElementById("messageArea").value;
    userKeyPair.setType("public");
    message = RSA.decryptWithKey(message, userKeyPair);
    document.getElementById("messageArea").value = message;
}

//decrypt with your private
function decryptWithYourPrivate() {
    decryptMyPrivate();
}

//decript with friends public
function decryptWithFriendsPublic() {
    var message = document.getElementById("messageArea").value;
    friendsKeyPair.setType("public");
    message = RSA.decryptWithKey(message, friendsKeyPair);
    document.getElementById("messageArea").value = message;
}


//error modal
//used alert instead...