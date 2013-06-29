var request_util = require('../util/request_util')
    , users_dao = require('../models/dao/users_dao')
;

module.exports = {
  index: function(req, res){
    res.render('login', {
        login_id: '', password: '', input_error:false, auto_login: false
    });
  },
  login: function(req, res){

    var params = request_util.editParams(
        req.body, {
            booleanParams: ['auto_login'],
            defaultParams: { auto_login: false }
        }
    );

    users_dao.findOne({ _id: params.login_id,
      password: params.password },
      function(err, user){
        var autoSaveTime = 1000 * 60 * 60 * 24 * 14;  // 2 weeks
        var exist = user ? true : false;
        params.input_error = !exist;
        if(exist){  //OK
          req.session.user = user;
          if(params.auto_login){
            req.session.cookie.expires = new Date(Date.now() + autoSaveTime);
          }
          res.redirect('/');
        }else{        //NG
          res.render('login', params);
        }
      }
    );
  },

  logout: function(req, res){
    delete req.session.user;
    res.render('login', {
        login_id: '', password: '', input_error:false, auto_login: false
    });
  }

};
