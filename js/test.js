function one(word) {
    i ={
        'r': () => (console.log('hello')),
        's': () => (console.log('go!'))
    }
    i[word]()
}


one('r')




