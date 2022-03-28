//create variable to hold db connection
let db;
//establish a connnection indexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

//this event will emit if the database version changes (nonexistent to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    //create an object store (table)  called `new_pizza`, set it to have an auto incrememnting primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//upon a sucessful
request.onsuccess = function(event) {
    //when db is sucessfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
    uploadPizza();
    }
};

request.onerror = function(event) {
    //log error here
    console.log(event.target.errorCode);
 };


//This function will be executed if we attampt to submit a new pizza an there's no internet connection
function saveRecord(record) {
    //open a new transaction with the database with read and write permission
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with add method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    //open a transaction on you db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    //upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        //if there was data in indexedDb's store, let's send to the api server
        if (getAll.result.length > 0) {
            fetch('api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizzas have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

};

//listen for app coming back online
window.addEventListener('online', uploadPizza);