/* eslint-disable no-console */

const helpers = require('./helper');
/**
 * Determine if launched from cmd.exe
 */

function getprompt() {
    return (process.platform === 'win32' &&
        process.env._ === undefined) ? '>' : '$'; 
}

function complete(name, path) {  
    const prompt = getprompt() ;
    console.log();
    console.log('   install dependencies:');
    console.log(`     ${prompt} cd ${path} && yarn install`);
    console.log();
    console.log('   run the app:');
    console.log(`     ${prompt} yarn dev`);
    console.log();
}

module.exports = async(appdata) => {
    try{
        // load the base templates
        const app = helpers.loadTemplate('js/app.js');
        const www = helpers.loadTemplate('js/server.js');

        app.locals.modulars = [];
        app.locals.uses = [];

        const isHandlebars = appdata.engine === 'hbs';
        // create paths
        const result = await helpers.mkdir(appdata.path);
        console.log(result);

        await helpers.createFolders(appdata, isHandlebars);

         
        // copy yhe images
        const imgeresp = await helpers.copyImage(`img/express.png`,`${appdata.path}/public/images/express.png`);
        console.log(imgeresp);
        
        // copy the css engine to the respective folder
        const ext = helpers.getCssEngine(appdata.cssengine);
        const cpCss = await helpers.copyTemplate(`css/style.${ext}`,`${appdata.path}/public/css/style.${ext}`);
        console.log(cpCss);
        
        // copy the routes to the destination folder
        const routesFiles = ['home.js', 'index.js', 'users.js'];
        routesFiles.forEach(async (file)=>{
            const routeResult = await helpers.copyTemplate(`js/routes/${file}`,`${appdata.path}/routes/${file}`);
            console.log(routeResult);
        });

        /* copy the controller files to the destination folder */
        // copy home controller
        const homeController =  helpers.loadTemplate('js/src/controllers/homeCtrl.js');
        homeController.locals.hbs = isHandlebars;
        const homeresp = await helpers.write(`${appdata.path}/src/controllers/homeCtrl.js`, homeController.render());
        console.log(homeresp);

        const controllerFiles = ['index.js', 'usersCtrl.js'];
        controllerFiles.forEach(async (file)=>{
            const srcresult = await helpers.copyTemplate(`js/src/controllers/${file}`,`${appdata.path}/src/controllers/${file}`);
            console.log(srcresult);
        });

        // copy the view files to the destination folder
        const viewfiles = await helpers.getViewFiles(appdata.engine);
        viewfiles.forEach(async (file)=>{
            const viewresult = await helpers.copyTemplate(`${appdata.engine}/${file}`,`${appdata.path}/views/${file}`);
            console.log(viewresult);
        });

        // copy the template for the hbs
        if (isHandlebars){
            let resulthbs = await helpers.copyTemplate(`partials/layout.hbs`,`${appdata.path}/views/partials/layout.hbs`);
            console.log(resulthbs);
            resulthbs = await helpers.copyTemplate(`partials/index.hbs`,`${appdata.path}/views/home.hbs`);
            console.log(resulthbs);
        }

        // generate the package.json file
        const packagejson = helpers.loadTemplate('js/package.json'); 
        const passdata = helpers.packagejson(appdata);
        
        packagejson.locals.data = passdata;
        // write the package json to file
        const packresp = await helpers.write(`${appdata.path}/package.json`, packagejson.render());
        console.log(packresp);

        /* write the app.js file */
        // process the css engine
        if (passdata.cssengine){
            app.locals.modulars.push ( passdata.css );
            app.locals.uses.push( passdata.css.use);
        }
        if (isHandlebars){
            app.locals.registerpartials = true;
            app.locals.modulars.push({
                key: 'hbs',
                value : 'hbs'
            });
        }
        // include the helment module
        if (passdata.helmet){
            app.locals.modulars.push({
                key: 'helmet',
                value : 'helmet'
            });
            app.locals.helmet = true;
        } 
        
        // process the view engine
        if (passdata.view.name === 'adaro'){
            app.locals.modulars.push({
                key: 'adaro',
                value : 'adaro'
            });
            app.locals.view = {
                engine : 'dust',
                render : 'adaro.dust()'
            }
        } else {
            app.locals.view = {
                engine : passdata.view.name
            }
        }
        // connect flash
        app.locals.connectflash = passdata.connectflash || false;
        // passport module
        app.locals.passport = passdata.passport || false;
        // cookie session
        app.locals.cookiesession = passdata.cookiesession || false;
        // pass the app data to the view 
        app.locals.data = appdata;
        // cookie keys
        const cookie = {
            key1 : Math.random().toString(36).slice(2),
            key2 : Math.random().toString(36).slice(2)
        };
        app.locals.data.cookie = cookie;
        
        const appresp = await helpers.write(`${appdata.path}/${appdata.entryfile}`, app.render());
        console.log(appresp);

        // write the server to file
        www.locals.data = appdata;
        const MODE_0755 = parseInt('0755', 8)
        const wwwresp = await helpers.write(`${appdata.path}/bin/server`, www.render(), MODE_0755);
        console.log(wwwresp);

        if (appdata.gitignore){
            const gitresp = await helpers.copyTemplate(`js/src/gitignore`,`${appdata.path}/.gitignore`);
            console.log(gitresp);
        }

        // sequelize
        if (passdata.sequelize){
            const seqresponse = await helpers.copyTemplate('js/src/sequelizerc',`${appdata.path}/.sequelizerc`);
            console.log(seqresponse);
        }

        // babel es6
        const babelresp = await helpers.copyTemplate('js/src/babelrc',`${appdata.path}/.babelrc`);
        console.log(babelresp);
        // eslint
        const eslconfig = await helpers.loadTemplate('js/src/eslint');
        const mdata = {};
        mdata[appdata.eslint] = true;
        eslconfig.locals.data = mdata;
        const esldata = await helpers.write(`${appdata.path}/.eslintrc`, eslconfig.render(), MODE_0755);
        console.log(esldata);
       

        // passport jwt
        if (appdata.passportjwt){
            const seqresponse = await helpers.copyTemplate('js/src/library/passport.js',`${appdata.path}/src/library/passport.js`);
            console.log(seqresponse);
        }

        // print the complete
        complete(appdata.projectname, appdata.path);

    } catch(error){
        console.log(error);
        throw error
    }

}