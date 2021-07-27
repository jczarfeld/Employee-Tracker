 const delay = (seconds=2) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000);
    } );
};
module.export = delay;