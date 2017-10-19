const path = require('path');
const fs = require('fs');
const util = require('util');
const hbs = require('hbs');

const dirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir); 

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

/**
 * get the name of the application
 * @param {string} pathName 
 */
module.exports.getAppName = function (pathName) {
    const projectpath = path.resolve(pathName);
    const projectname = path.basename(projectpath)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase()
    return {
        projectname,
        projectpath
    }
}


/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path 
 */

module.exports.isDirectoryEmpty = async function (destinationpath) {
    try {
        const files = await dirAsync(destinationpath);
        return !files || !files.length;
    } catch (error) {
        return error.code === 'ENOENT';
    }
}

/**
 * 
 * @param {string} name the name of the template file to load
 */
module.exports.loadTemplate = (name) => {
    const template = fs.readFileSync(path.join(__dirname, '..', 'templates', `${name}.hbs`), 'utf-8')
    const locals = Object.create(null)

    function render() {
        const templatescript = hbs.compile(template);
        return templatescript(locals); 
    }

    return {
        locals,
        render 
    }
}

/**
 * make directory
 * @param {string} pathName
 */
const mkdir = async(pathName) => {
    try {
        const projectpath = path.resolve(pathName);
        await mkdirAsync(projectpath, MODE_0755);
        return `   \x1b[36mcreate\x1b[0m : ${pathName}`;
    } catch (error) {
        if (error.code === 'EEXIST'){
            return `   \x1b[36mcreate\x1b[0m : .`;
        }
        throw error;
    }
}

module.exports.mkdir = mkdir;

/**
 * echo str > path.
 *
 * @param {String} mpath
 * @param {String} str
 */
const write = async(mpath, str, mode) => {
    try {
        const tofile = path.resolve(mpath); 
        fs.writeFileSync(tofile, str, {
            mode: (mode || MODE_0666)
        });
        return `   \x1b[36mcreate\x1b[0m : ${mpath}`;
    } catch (error) { 
        throw error;
    }
}
module.exports.write = write;


/**
 * Copy file from template directory.
 * @param {string} from 
 * @param {string} to
 */

module.exports.copyTemplate = async(from, to) => {
    try {
        const fromFolder = path.join(__dirname, '..', 'templates', from);
        return await write(to, fs.readFileSync(fromFolder, 'utf-8'))
    } catch(error){ 
        throw error;
    }
}

/**
 * return the css engine extension
 * @param {string} cssengine
 */
module.exports.getCssEngine = (cssengine) =>{
    const data = {
        css : 'css',
        less : 'less',
        sass : 'sass',
        stylus : 'styl',
        compass : 'scss'
    }
    return data[cssengine] || 'css'; 
}

module.exports.getViewFiles = async (view) =>{
    const destinationpath = path.join(__dirname, '..', 'templates', view)
    return await dirAsync(destinationpath);
}

const viewEngineVersion = {
    hbs : '~4.0.1',
    adaro : '~1.0.4',
    pug : '^2.0.0-rc.4',
    twig : '~0.10.3',
    vash : '~0.12.2',
    ejs : '~2.5.7',
    hjs : '~0.0.6'
}
/**
 *  return the object for the hbs template context
 * @param {Object} data
 */
module.exports.packagejson = (data) =>{
    const ret = {
        projectname : data.projectname,
        version : data.version,
        description : data.description
    };
    data.dependencies.forEach( dep => {
        const defname = dep.replace('-','');
        ret[defname] = true;
    });
    // view engine
    const viewengine = data.engine === 'dust'? 'adaro' : data.engine;
    ret.view = {
        name : viewengine,
        version : viewEngineVersion[viewengine]
    };

    const cssengine = {
        less : ['less-middleware','~2.2.1','lessMiddleware',`lessMiddleware(path.join(__dirname, 'public'))`],
        compass : ['node-compass','0.2.3','compass',`compass({ mode: 'expanded' })`],
        stylus : ['stylus','0.54.5','stylus',`stylus.middleware(path.join(__dirname, 'public'))`],
        sass :['node-sass-middleware','0.9.8','sassMiddleware',`sassMiddleware({\n  src: path.join(__dirname, 'public'),\n  dest: path.join(__dirname, 'public'),\n  indentedSyntax: true, // true = .sass and false = .scss\n  sourceMap: true\n})`]
    }
    const checkCssEngine = cssengine[data.cssengine];
    if (checkCssEngine){
        ret.cssengine = true;
        ret.css = {
            name : checkCssEngine[0],
            version : checkCssEngine[1],
            key : checkCssEngine[2],
            value : checkCssEngine[0],
            use : checkCssEngine[4]
        }
    }  

    // eslint
    ret[data.eslint] = true;

    // babel
    ret.babel = true;

    return ret;
}


module.exports.createFolders = (appdata,isHandlebars) => {
    // create the folder structure 
    const levelOnefolders = [
        '/bin',
        '/public', 
        '/routes', 
        '/views',
        '/src' 
    ];

    const levelTwoFolders = ['/public/js', '/public/images', '/public/css','/src/controllers', '/src/models'];
    if (isHandlebars){
        levelTwoFolders.push('/views/partials')
    }
    // loop through the array to create all the folders
    levelOnefolders.forEach( async (folder)=>{
        const createFolderResult = await mkdir(`${appdata.path}${folder}`);
        console.log(createFolderResult); // eslint-disable-line
    });
    levelTwoFolders.forEach( async (folder)=>{
        const createFolderResult = await mkdir(`${appdata.path}${folder}`);
        console.log(createFolderResult); // eslint-disable-line
    });
    
}