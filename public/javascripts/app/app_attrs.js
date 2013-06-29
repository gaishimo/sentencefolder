define([], function(){
  var user_id = $('body').attr('data-user-id');
  return {
    user_id: user_id
  };
});