const inquirer = require("inquirer");
// const db = require("./db/dbQueries");
const connection = require("./db/connection");


connection.connect((error) => {
  if (error) throw error;
  promptUser();
});


const promptUser = () => {

  
  inquirer.prompt([{
      name: "choices",
      type: "list",
      message: "Please select an option:",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit"
      ]
    }
  ])
    .then((answers) => {
      const {
        choices
      } = answers;
if (choices === "View All Departments") {
        viewDepartments();
      }
if (choices === "View All Roles") {
        viewRoles();
      }
if (choices === "View All Employees") {
        viewEmployees();
      }
 if (choices === "Add Department") {
        addDepartment();
      }
if (choices === "Add Role") {
        addRole();
      }
if (choices === "Add Employee") {
        addEmployee();
      }
      if (choices === "Update Employee Role") {
        updateRole();
      }
if (choices === "Exit") {
        connection.end();
      }
    });
};

const viewDepartments = () => {
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

const viewRoles = () => {

  const sql = `SELECT role.id, role.title, department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    response.forEach((role) => {
      console.log(role.title);
    });
  promptUser();
  });
};

const viewEmployees = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;

    console.table(response);

    promptUser();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([{
      name: 'newDepartment',
      type: 'input',
      message: 'Whats the name of the Department?',
      validate: validate.validateString
    }])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
       console.table(response);
        viewDepartments();
      });
    });
};

const addRole = () => {
  const sql = 'SELECT * FROM department'
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    let departmentsArray = [];
    response.forEach((department) => {
      departmentsArray.push(department.department_name);
    });
    departmentsArray.push('Create Department');
    inquirer
      .prompt([{
        name: 'departmentName',
        type: 'list',
        message: 'Which department the role in?',
        choices: departmentsArray
      }])
      .then((answer) => {
        if (answer.departmentName === 'Create Department') {
          this.addDepartment();
        } else {
          addRoles(answer);
        }
      });

    const addRoles = (departmentData) => {
      inquirer
        .prompt([
          {
            name: 'salary',
            type: 'input',
            message: 'Whats the salary?',
            validate: validate.validateSalary
          },
          {
            name: 'newRole',
            type: 'input',
            message: 'Whats the name of your new role?',
            validate: validate.validateString
          }
       
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let crit = [createdRole, answer.salary, departmentId];

          connection.promise().query(sql, crit, (error) => {
            if (error) throw error;
            
            viewRoles();
          });
        });
    };
  });
};

const addEmployee = () => {
  inquirer.prompt([{
        type: 'input',
        name: 'fistName',
        message: "What is their first name?",
        validate: addFirstName => {
          if (addFirstName) {
            return true;
          } else {
            console.log('Please enter first name');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is theirs last name?",
        validate: addLastName => {
          if (addLastName) {
            return true;
          } else {
            console.log('Please enter last name');
            return false;
          }
        }
      }
    ])
    .then(answer => {
      const crit = [answer.fistName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.promise().query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({
          id,
          title
        }) => ({
          name: title,
          value: id
        }));
        inquirer.prompt([{
            type: 'list',
            name: 'role',
            message: "Whats the employee's role?",
            choices: roles
          }])
          .then(roleChoice => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.promise().query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({
                id,
                first_name,
                last_name
              }) => ({
                name: first_name + " " + last_name,
                value: id
              }));
              inquirer.prompt([{
                  type: 'list',
                  name: 'manager',
                  message: "Whos the employee's manager?",
                  choices: managers
                }])
                .then(managerChoice => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee added")
                    viewEmployees();
                  });
                });
            });
          });
      });
    });
};

const updateRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    let employeeArray = [];
    response.forEach((employee) => {
      employeeArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    let sql = `SELECT role.id, role.title FROM role`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([{
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee is changing roles?',
            choices: employeesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Whats the new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newJobId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newJobId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(
            sqls,
            [newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              
              promptUser();
            }
          );
        });
    });
  });
};



