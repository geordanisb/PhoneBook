const fs = require('fs');

module.exports = class PhoneBook{
    constructor(path) {
        this.contacts = new Map();//i guess one phone number per contact
        this.phones = {
            BG: /^((\+?|00)359|0)?8[789]\d{7}$/,
        }
        this.loadFromFile(path);
    }

    add(name,phone_number){
        this.contacts.set(name,phone_number);
    }

    delete(name){
        this.contacts.delete(name);
    }

    get(name){
        return this.contacts.get(name);
    }

    printContactsOrdered(path){
        let contactsOrdered = [...this.contacts].sort(function(a, b) {
            let nameA = a[0].toUpperCase();
            let nameB = b[0].toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.saveToFile(path,contactsOrdered);
    }

    loadFromFile(path){
        
        let data = fs.readFileSync(path,'utf8');
        let lines = data.split('\n');
        for(let l of lines){
            l = l.replace("(","");
            l = l.replace(")","");
            let [name, phone_number] = l.split(",");
            let pn = this.normalizePhoneNumber(phone_number);
            if(pn)
                this.add(name,pn);
        }
        console.log(this.contacts,'loadFromFile');    
    }

    saveToFile(path,contacts){
        
        fs.open(path, 'a', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT')
                    console.log(`File in path: ${path} does not exist`);                
                throw err;
            }              
            console.log(this.contacts,'saveToFile')
            for(let [k,v] of contacts.entries()){
                fs.appendFile(fd, `(${v})\n`, 'utf8', (err) => {
                    if (err) throw err;
                });                
            }
            fs.close(fd, (err) => {
                if (err) throw err;
                return true;
            });            
        });
        
    }

    normalizePhoneNumber(pn){
        let phones = {
            'BG': /^((\+?|00)359|0)?8[789]\d{7}$/,
        }
        let p = null;
        if(pn.match(phones.BG))
            p = pn.match(phones.BG)[0];
        if(!p)
            return null;            
        switch(p.length){
            case 10://0?????????
                return p.replace(/^0/,"+359");
            case 14://00359?????????
                return p.replace(/^(00)/,"+");
        }        
        return p;                
    }

}