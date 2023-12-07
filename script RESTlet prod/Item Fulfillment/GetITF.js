/**
 * This SuiteScript RESTlet retrieves information about an Item Fulfillment.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'], function(search) {
    function getItemFulfillmentByCreatedFrom(createdFromId) {
      //var createdFromId = data.createdFromId; // Get the createdfrom value from the request data
  
      var fulfillmentSearch = search.create({
        type: search.Type.ITEM_FULFILLMENT,
        filters: [['createdfrom', 'is', createdFromId]],
        columns: ['internalid', 'tranid', 'custbody_scv_inv_po']
      });
  
      var fulfillmentData = [];
      fulfillmentSearch.run().each(function (result) { 
  
      var fulfillment = {
          internalid: result.getValue('internalid'),
          tranid: result.getValue('tranid'),
        //  id: result.getValue({ name: 'id' }),
        //  createddate: result.getValue({ name: 'created' }),
          custbody_scv_inv_po: result.getValue('custbody_scv_inv_po')
        };
        fulfillmentData.push(fulfillment);
        return true;
      });
  
      return fulfillmentData;
    }
  
    function doGet(context) {
      var createdFromId = context.createdFromId;
  
      // Check if refNum is provided
      if (!createdFromId) {
        throw new Error('Reference number is required.');
      }
  
      var itemfulfillments = getItemFulfillmentByCreatedFrom(createdFromId);
      // Check if any inventory transfers are found
      if (itemfulfillments.length === 0) {
       // throw new Error('Item Fulfillment not found.');
        return JSON.stringify([]);
      }
  
      return JSON.stringify(itemfulfillments)
    }
  
    return {
      get: doGet
    };
  });
  