 /**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope Public
 */

 define(['N/record'], function(record) {
    // Create the Inventory Transfer record
    function createTransferOrder(transferData) {
    var transferRecord = record.create({
      //type: record.Type.TRANSFER_ORDER,
      type: 'transferorder',
      isDynamic: true
    });

  log.debug("custbody_scv_inv_po" , transferData.custbody_scv_inv_po)
    // Set the transfer data fields
    transferRecord.setValue('subsidiary', transferData.subsidiary);
    transferRecord.setValue('transferlocation', transferData.transferlocation);
    transferRecord.setValue('location', transferData.location);
    transferRecord.setValue('tranDate', transferData.tranDate);
    transferRecord.setValue('memo', transferData.memo);
   // transferRecord.setValue('customform', transferData.customform);
//    transferRecord.setValue('incoterm', transferData.incoterm);
    transferRecord.setValue('orderstatus', transferData.orderstatus);
   // transferRecord.setValue('currency', transferData.currency);
    transferRecord.setValue('custbodysapo_status', transferData.custbodysapo_status);
    transferRecord.setValue('custbody_scv_inv_po', transferData.custbody_scv_inv_po);
    transferRecord.setValue('custbody_sapo_number' , transferData.custbody_sapo_number);
    // set value for item
   // log.debug("item" , transferData.item)
   // set value for new line item(item)

    log.debug("transferRecord:" , JSON.stringify(transferRecord));
      
    //log.debug("itemlength:" , transferData.item.length)
      

      for (var i = 0; i < transferData.item.length ; i++) {
        //var items = transferData.item[i];
        transferRecord.selectNewLine({
        sublistId: 'item'
  });

  // Set the item internal ID for the line item
    transferRecord.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: transferData.item[i].item
  }); 
     transferRecord.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: transferData.item[i].quantity 
  });
        transferRecord.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'rate',
    value: transferData.item[i].rate 
  });
 
    transferRecord.commitLine({
    sublistId: 'item'
  });
  } 
//  } 
  //    log.debug("transferRecord:" , JSON.parse(JSON.stringify(transferRecord))); 
   // var currentSubListItem = transferRecord.getSublistValue({ sublistId: 'item', fieldId: 'item'});
 //   log.debug("currentSubListItem:", currentSubListItem);
       
            // sublist accountingbookdetail
     
      log.debug("transferRecord: ", JSON.stringify(transferRecord));
      
    var transferId = transferRecord.save();
    return transferId;
    }
      
    function doPost(context) {
    log.debug("content", context)
    var transferData = JSON.parse(JSON.stringify(context));
    
    // Check if transfer data is provided
    if (!transferData) {
      throw new Error('Transfer data is required.');
    }
    var newTransferId = createTransferOrder(transferData);
    return newTransferId;
  }
  return {
    post: doPost
  };
});