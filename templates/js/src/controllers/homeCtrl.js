
class HomeController {
    homepage(req, res){
        res.render('index');
    } 
    /* 
    // to use the hbs partial templates uncomment below
    homepage(req, res){
        res.render('home', { layout: '', title : 'Homepage'});
    }
    */
}

module.exports = new HomeController();