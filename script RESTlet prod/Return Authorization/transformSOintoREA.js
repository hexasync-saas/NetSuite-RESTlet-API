/**
 * This SuiteScript RESTlet transforms a Return Authorization into an Item Receipt.
 * The Item Receipt will include line items and a location.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {
    function transformToReturnAuthorization(data) {
        var salesOrderId = data.salesOrderId;
  
        // Load the Sales Order
      var salesOrder = record.load({
          type: record.Type.SALES_ORDER,
          id: salesOrderId,
          isDynamic: true
        });
     
        // Transform the Sales Order into a Return Authorization
        var returnAuth = record.transform({
          fromType: record.Type.SALES_ORDER,
          fromId: salesOrderId,
          toType: record.Type.RETURN_AUTHORIZATION,
          isDynamic: true
        });
      
        // Loop through Transfer Order lines and copy them to Item Receipt
       var lineItemCount = salesOrder.getLineCount({ sublistId: 'item' });
  
        // Loop through Transfer Order line items and copy them to Item Receipt
        for (var i = 0; i < lineItemCount; i++) {
          try {
          var quantity = returnAuth.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
  
     //     log.debug('quantity', quantity)
          
          returnAuth.selectLine({ sublistId: 'item', line: i });
         // var itemReceiveDefault = itemReceipt.getCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive' });
          // Set the itemreceive field to false
        //  itemReceipt.setCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive', value: !itemReceiveDefault });
          returnAuth.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: quantity });
          // You can set more sublist fields if needed
          returnAuth.commitLine({ sublistId: 'item' });
        } catch (ex){
            log.error('Sublist Operation Error', ex.message);
      return { success: false, errorMessage: ex.message };
    }
        }
        // Save the Item Receipt
        var returnAuthId = returnAuth.save();
    //    log.debug('returnAuthId', returnAuthId)
        return returnAuthId;
    }
  
    function doPost(context) {
    if (context) { // Check if there is a request object
      var requestData = JSON.parse(JSON.stringify(context)); // Parse the request body
      var response = transformToReturnAuthorization(requestData);
      return response;
    } else {
      return { error: 'Thai Thanh Tuan' };
    }
  }
  
    return {
      post: doPost
    };
  });