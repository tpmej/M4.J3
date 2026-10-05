// 7.

//  function getGreeting(user) {
//      if (user) {
//          var name = user.name;
//          let message = "Witaj " + name;
//      }
//      return message; // Błąd: ReferenceError!
//  }

// Błąd: message zostało zadeklarowane w bloku if, message ma tylko zasięg blokowy.
// Rozwiązanie: Zadeklarować message w bloku function, wczsesniej, za pomocą var a nie let.

function getGreeting(user) {
    var message;
    if (user) {
        var name = user.name;
        message = "Witaj " + name;
    }
    return message; // Błąd: ReferenceError!
}

getGreeting({name: "przyklad"})

// 8.

const getAdults = (people) => 
    people
        .filter(person => person.age >= 18)
        .map(person => person.name);