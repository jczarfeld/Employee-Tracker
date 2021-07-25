const inquirer = require('inquirer');
const db = require("./db/dbQueries");

// Inquirer prompts signify which function(viewAllEmployees) is called -- switch or if statement






viewEmployees = () => {
    db.findAllEmployees().then((rows) => {
        console.table(rows);
    })
}

viewEmployees();

//use either the view employees function above or the async await version below

// async function viewEmployees () {
//     let employees=await db.findAllEmployees();
//     console.table(employees);
// }

// viewEmployees();