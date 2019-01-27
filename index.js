let PhoneBook = require('./PhoneBook');
let pb = new PhoneBook('./numbers.txt');//New PhoneBook instance from numbers.txt

pb.printContactsOrdered('./test.txt');//Print all valid pairs sorted by name in test.txt file
console.log(pb.get('Cami'));