
/**
 * 
 * @param {mongooseSession || null} session - or nothing
 * @returns {object}
 */
module.exports = function(session=null){
    let Opt = {new:true,runValidators:true};

    if(session) Opt.session = session;

    return Opt;
};