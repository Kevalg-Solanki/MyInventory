


function prepareProperDataForPagination(pagination,totalNumberOfDocs){

    const totalPages = Math.ceil(totalNumberOfDocs/pagination.limit);
    
    return {
        currentPage:pagination.page,
        totalPages,
        pageSize:pagination.limit,
        totalDocuments:totalNumberOfDocs,
        hasPreviousPage: pagination.page>1,
        hasNextPage: pagination.page < totalPages
    }

}

module.exports = prepareProperDataForPagination;