/**
 * This SuiteScript RESTlet retrieves information about an Item Receipt.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'], function(search) {
    function getItemReceiptById(createdFromId) {
      var receiptSearch = search.create({
        type: search.Type.ITEM_RECEIPT,
        filters: [['createdfrom', 'is', createdFromId]],
        columns: ['internalid', 'tranid', 'memo']
      });
  
      var receiptData = [];
      receiptSearch.run().each(function(result) {
        var receipt = {
          internalid: result.getValue('internalid'),
          tranid: result.getValue('tranid'),
         // createddate: result.getValue('createddate'),
          memo: result.getValue('memo')
        };
        receiptData.push(receipt);
        return true;
      });
  
      return receiptData;
    }
  
    function doGet(context) {
      var createdFromId = context.createdFromId;
  
      // Check if itemReceiptId is provided
      if (!createdFromId) {
        throw new Error('Item Receipt ID is required.');
      }
  
      var itemReceipts = getItemReceiptById(createdFromId);
      // Check if any item receipts are found
      if (itemReceipts.length === 0) {
        return JSON.stringify([]); // Return an empty array
      }
  
      return JSON.stringify(itemReceipts);
    }
  
    return {
      get: doGet
    };
  });
  