const  questions = [
    {
        name : 'version',
        message : 'Version ',
        default : '1.0.0' 
        // validate to ensure the format is the same as 1.0.0
    },{
        name : 'description',
        message : 'Description'
    },{
        name : 'entryfile',
        message : 'Enter file name for entry point ',
        default : 'app.js'
    },{
        type : 'list',
        name : 'eslint',
        message : 'Select which eslint configuration to use',
        choices : [
            'prettier',
            'airbnb',
            'standard'
        ]
    },{
        type : 'checkbox',
        name : 'dependencies',
        message : 'Select the modules to include in your dependencies',
        choices : [
            {
                name : 'sequelize'
            },{
                name : 'passport'
            },{
                name : 'connect-flash'
            },{
                name : 'cookie-session'
            },{
                name : 'multer'
            },{
                name : 'jsonwebtoken'
            },{
                name : 'bcryptjs'
            },{
                name : 'helmet'
            }
        ]
    },{
        type : 'list',
        name : 'database',
        message : 'Select the database for sequelize',
        choices : [ 'mysql', 'sqlite', 'postgres','mssql'],
        default : 'mysql',
        when : (answer) => (answer.dependencies.indexOf('sequelize') > -1)
        
    },{
        type : 'confirm',
        name : 'passportjwt',
        message : 'Enable passport authentication for JWT ',
        default : false,
        when :  (answer) =>  (answer.dependencies.indexOf('jsonwebtoken') > -1),
    },{
        type : 'list',
        name : 'engine',
        message : 'Select View engine support',
        choices : [
            'ejs',
            'hbs',
            'pug',
            'dust',
            'hjs',
            'hogan',
            'twig',
            'vash'
        ],
        default : 'hbs'
    },{
        type : 'list',
        name : 'cssengine',
        message : 'Select CSS Engine to use',
        choices  : [
            'css',
            'less',
            'sass',
            'stylus',
            'compass'
        ],
        default : 'css'
    },{
        type : 'confirm',
        name : 'gitignore',
        message : 'Add .gitignore',
        default : true
    }
];


module.exports.setquestions = function(projectdata){
    const projectname = {
        name : 'projectname',
        message : 'package name',
        default : projectdata
    }
    questions.unshift(projectname);
    return questions; 
}


module.exports.confirmDeletion = ( path ) => {
    const message = `Destination (${path}) is not empty. \n  Continue ? `;
    return [
        {
            type : 'confirm',
            name : 'confirmdeletion',
            message ,
            default : false
        }
    ]
}