
class UsersController {
    users(req, res){
        res.status(201).send({
            response : 'success'
        })
    } 
}

module.exports = new HomeController();