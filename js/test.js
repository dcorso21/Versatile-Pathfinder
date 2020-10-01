function one() {
    return new Promise(resolve => {
        resolve(5)
    })
}


async function two() {
    let s = await one()
    console.log(s);
}


two()




