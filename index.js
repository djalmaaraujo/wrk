// const sade = require('sade')
// const prog = sade('wrk')
// const version = require('./package.json').version
// const figlet = require('figlet')
// const chalk = require('chalk')
// const clear = require('clear')
// const columnify = require('columnify')
// const inquirer = require('inquirer')
// const Listr = require('listr')

// const layout = new Promise((rs, rj) => {
//   figlet('wrk logger', (err, data) => {
//     if (err) rj(err)

//     clear()
//     console.log(chalk.yellow(data))
//     rs(true)
//   })
// })

// layout.then(() => {
//   prog.version(version)

//   prog
//     .command('<entry>')
//     .describe('List your entries')
//     .option('-a, --add')
//     .action((entry, opts) => {
//       console.log('Your recent entries:')
//       console.log(entry)

//       const columns = columnify([
//         {
//           time: '10h45',
//           description: 'Changed paypal’s URL configuration'
//         },
//         {
//           time: '19h45',
//           description: 'Worked on the orange/purple story'
//         },
//         {
//           time: '09:45',
//           description: 'Started the QA for brian’s task: Replace custom columns with new column names and values'
//         },
//         {
//           time: '19h45',
//           description: 'Worked on the orange/purple story'
//         }],
//         {
//           minWidth: 10
//         }
//       )

//       console.log('')
//       console.log(chalk.bold.underline.yellow('19/03/2018'))
//       console.log('')
//       console.log(columns)
//       console.log('')
//       console.log(chalk.bold.underline.yellow('11/03/2018'))
//       console.log('')
//       console.log(columns)
//       console.log('')
//       console.log(`${chalk.gray('Type:')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('your new report message')} ${chalk.gray('to add a new entry')}`)
//       console.log(`${chalk.gray('OR')} ${chalk.bold.yellow('wrk')} ${chalk.yellow('-h')} ${chalk.gray('for all options.')}`)
//     })


//   prog
//     .command('login')
//     .describe('Login with Google or Github to keep your data stored in the cloud')
//     .option('-login --login')
//     .action((opt, opts) => {
//       inquirer.prompt([
//         {
//           type: 'list',
//           name: 'provider',
//           message: 'Which authentication provider you want to use?',
//           choices: [
//             'Login using Google',
//             'Login using Github',
//             new inquirer.Separator(),
//             'Nevermind'
//           ]
//         }
//       ])
//       .then(answers => {
//         const tasks = new Listr([
//           {
//             title: 'Waiting for your token to arrive...',
//             task: () => {
//               return new Promise((rs, rj) => {
//                 shell.openExternal('')
//                 // Go to login
//                 // Use a token to identify later
//                 // Keep pinging the API to check if user logged
//                 setTimeout(() => {
//                   rs('Foo')
//                 }, 2000)
//               })
//             }
//           },
//           {
//             title: 'Waiting for your token to arrive...',
//             task: () => {
//               return new Promise((rs, rj) => {
//                 // Open browser
//                 // Go to login
//                 // Use a token to identify later
//                 // Keep pinging the API to check if user logged
//                 setTimeout(() => {
//                   rs('Foo')
//                 }, 2000)
//               })
//             }
//           }
//         ])

//         tasks.run()
//       })
//     })

//   prog.parse(process.argv)
// })