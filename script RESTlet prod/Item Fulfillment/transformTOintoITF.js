/**
 * This SuiteScript RESTlet transforms a Transfer Order into an Item Fulfillment.
 * The Item Fulfillment will include line items and a location.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {
    function createItemFulfillment(data) {
        var transferOrderId = data.transferOrderId;
        var locationId = data.locationId; // Location ID for the Item Fulfillment
        var lineItems = data.lineItems;
        log.debug('data', data)
        // Load the Transfer Order
      var transferOrder = record.load({
          type: record.Type.TRANSFER_ORDER,
          id: transferOrderId,
          isDynamic: true
        });
      var trandate = transferOrder.getValue('trandate');
      var memo = transferOrder.getValue('memo');
      
      log.debug('trandate', trandate)
      log.debug('memo', memo)
        // Create an Item Fulfillment
        var itemFulfillment = record.transform({
          fromType: 'transferorder',
          fromId: transferOrderId,
          toType: 'itemfulfillment',
          isDynamic: true
        });
      
     // log.debug('itemFulfillment', itemFulfillment)
        // Set the location on the Item Fulfillment
     //   itemFulfillment.setValue('location', locationId); 
      //  itemFulfillment.setValue({ fieldId: 'trandate', value: trandate }); //new Date()
  
        // Loop through Transfer Order lines and copy them to Item Fulfillment
       var lineItemCount = itemFulfillment.getLineCount({ sublistId: 'item' });
  
        // Loop through Transfer Order line items and copy them to Item Fulfillment
        for (var i = 0; i < lineItemCount; i++) {
          try {
     //     var itemId = transferOrder.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
          var quantity = transferOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
     //     var itemreceive = transferOrder.getSublistValue({ sublistId: 'item', fieldId: 'itemreceive', line: i });
  
      //    log.debug('item', itemId)
          log.debug('quantity', quantity)
     //     log.debug('itemreceive', itemreceive)
          
          itemFulfillment.selectLine({ sublistId: 'item', line: i });
          var itemReceiveDefault = itemFulfillment.getCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive' });
          log.debug('itemReceiveDefault', itemReceiveDefault)
          //itemFulfillment.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: itemId });
          // Set the itemreceive field to false
          itemFulfillment.setCurrentSublistValue({ sublistId: 'item', fieldId: 'itemreceive', value: !itemReceiveDefault });
            //log.debug('itemreceive', itemreceive)
            itemFulfillment.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: quantity });
          // You can set more sublist fields if needed
          itemFulfillment.commitLine({ sublistId: 'item' });
        } catch (ex){
            log.error('Sublist Operation Error', ex.message);
      return { success: false, errorMessage: ex.message };
    }
        }
        // Save the Item Fulfillment
        var fulfillmentId = itemFulfillment.save();
        return fulfillmentId;
    }
  
    function doPost(context) {
    if (context) { // Check if there is a request object
      var requestData = JSON.parse(JSON.stringify(context)); // Parse the request body
      var response = createItemFulfillment(requestData);
      return response;
    } else {
      return { error: 'Thai Thanh Tuan' };
    }
  }
  
    return {
      post: doPost
    };
  });