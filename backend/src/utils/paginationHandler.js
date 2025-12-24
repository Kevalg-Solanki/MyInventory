


/**
 * 
 * @param {string} page - req.query.page return "1" (string)
 * @param {string} limit - req.query.limit return "1" (string)
 * @param {string} sort - req.query.sort (string)
 * @returns {object} - {page,limit,sort}
 */
function paginationHandler(page,limit,sortQuery=null){

    const convertedPage = Math.max(1,parseInt(page || "1",10)||1);
    const convertedLimit = Math.max(1,parseInt(limit || "10",10)||10);
    
    //skip
    const skip = (convertedPage-1) * limit;

    const properSort= parseSort(sortQuery);

    return {page:convertedPage,limit:convertedLimit,skip,sort:properSort};
}

/**
 * 
 * @param {string} sortQuery - e.g "-createdAt" or "createdAt=1,firstName=-1"
 * @returns {object}
 */
function parseSort(sortQuery=null){
    if(!sortQuery) return {createdAt:-1};
    //1. convert string to array by spliting with ",".
    //2. convert each element of array into object key and value
    //   by spliting it with ":", default -1 for short value "-createdAt".
    //3. 
    return sortQuery.split(",").reduce((acc,currentValue)=>{
        //example:["createdAt","1"||-1] = currentValue.split(":");
        const [key,value="-1"] = currentValue.split(":");

        //example: acc["createdAt"] = 1
        //example: acc = {createdAt:1};
        acc[key.replace("-","")]= value.startsWith("-")? -1 : 1;
        
        //example: return {createdAt:1};
        return acc;
    },{});


}


module.exports = paginationHandler;