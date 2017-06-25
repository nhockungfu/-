module.exports = function(req, res, next) {
    if (req.session.isLogged === true) {
        next();
    } else {
    	var url = '/home/dangnhap?retUrl=' + req.originalUrl;
        res.redirect(url);
    }
};