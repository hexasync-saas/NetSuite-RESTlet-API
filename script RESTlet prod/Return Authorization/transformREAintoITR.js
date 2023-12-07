/**
 * This SuiteScript RESTlet transforms a Return Authorization into an Item Receipt.
 * The Item Receipt will include line items and a location.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {
    function createItemReceipt(data) {
        var returnAuthId = data.returnAuthId;
  
        // Load the Transfer Order
      var returnAuth = record.load({
          type: record.Type.RETURN_AUTHORIZATION,
          id: returnAuthId,
          isDynamic: true
        });
     
        // Create an Item Fulfillment
        var itemReceipt = record.transform({
          fromType: record.Type.RETURN_AUTHORIZATION,
          fromId: returnAuthId,
          toType: 'itemreceipt',
          isDynamic: true
        });
      
        // Loop through Transfer Order lines and copy them to Item Receipt
       var lineItemCount = itemReceipt.getLineCount({ sublistId: 'item' });
  
        // Loop through Transfer Order line items and copy them to Item Receipt
        for (var i = 0; i < lineItemCount; i++) {
          try {
          var quantity = returnAuth.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
  
     //     log.debug('quantity', quantity)
          
          itemReceipt.selectLine({ sublistId: 'item', line: i });
          var itemReceiveDefault = itemReceipt.getCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive' });
          // Set the itemreceive field to false
          itemReceipt.setCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive', value: !itemReceiveDefault });
          itemReceipt.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: quantity });
          // You can set more sublist fields if needed
          itemReceipt.commitLine({ sublistId: 'item' });
        } catch (ex){
            log.error('Sublist Operation Error', ex.message);
      return { success: false, errorMessage: ex.message };
    }
        }
        // Save the Item Receipt
        var receiptId = itemReceipt.save();
    //    log.debug('receiptId', receiptId)
        return receiptId;
    }
  
    function doPost(context) {
    if (context) { // Check if there is a request object
      var requestData = JSON.parse(JSON.stringify(context)); // Parse the request body
      var response = createItemReceipt(requestData);
      return response;
    } else {
      return { error: 'Thai Thanh Tuan' };
    }
  }
  
    return {
      post: doPost
    };
  });