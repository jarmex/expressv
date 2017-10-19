#!/usr/bin/env node

const inqr = require('inquirer');
const fs = require('fs');

const createapp = require('./createapp');
const questions = require('./questions');
const helpers = require('./helper');



// get the project name either from the folder or the argv

async function setenv(){
    try{
        const destinationPath = process.argv[2] || '.';
        const { projectname, projectpath } = helpers.getAppName(destinationPath) || 'demo';
        const isDirEmpty = await helpers.isDirectoryEmpty(projectpath);

        if (!isDirEmpty){
            const results = await inqr.prompt(questions.confirmDeletion(projectpath));
            if (results.confirmdeletion){
                // delete all files in the current folder
                // process.stdin.destroy(); 
            } else {
                console.error('aborting.....');
                return;
            }
        } 
        //set questionnaires
        const response = await inqr.prompt(questions.setquestions(projectname));
        // add the destination path to the response
        response.projectpath = projectpath;
        response.path = destinationPath;
        //create application
        const display = await createapp(response);
    } catch(error){
        console.error(error);
        process.exit(1);
    }
    
}


setenv();

