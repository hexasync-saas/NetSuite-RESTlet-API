/**
 * This SuiteScript RESTlet retrieves information about a specific Return Authorization by internal ID.

 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'], function(search) {
    function getReturnAuthorizationBycreatedFrom(createdFromId) {
      //var createdFromId = data.createdFromId; // Get the createdfrom value from the request data
  
      var returnAuthorizationSearch = search.create({
        type: search.Type.RETURN_AUTHORIZATION,
        filters: [['createdfrom', 'is', createdFromId]],
        columns: ['internalid', 'tranid', 'trandate', 'memo']
      });
  
      var returnAuthData  = [];
      returnAuthorizationSearch.run().each(function (result) { 
  
      var returnAuth = {
          internalid: result.getValue('internalid'),
          tranid: result.getValue('tranid'),
        //  id: result.getValue({ name: 'id' }),
        //  createddate: result.getValue({ name: 'created' }),
          trandate: result.getValue('trandate'),
          memo: result.getValue({ name: 'memo' })
        };
        returnAuthData.push(returnAuth);
        return true;
      });
  
      return returnAuthData;
    }
  
    function doGet(context) {
      var createdFromId = context.createdFromId;
  
      // Check if refNum is provided
      if (!createdFromId) {
        throw new Error('Reference number is required.');
      }
  
      var returnAuths = getReturnAuthorizationBycreatedFrom(createdFromId);
      // Check if any inventory transfers are found
      if (returnAuths.length === 0) {
       // throw new Error('Return Authorization not found.');
        return JSON.stringify([]);
      }
  
      return JSON.stringify(returnAuths)
    }
  
    return {
      get: doGet
    };
  });
  