/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
    /**
     * Function to update an inventory transfer record.
     * @param {Object} data - The data received from the client.
     * @returns {Object} The result of the update operation.
     */
    function updateTransferOrder(data) {
      var transferId = data.transferId; // The ID of the inventory transfer record to update
      var newLocation = data.newLocation; // The new location to update on the inventory transfer
      var newMemo = data.newMemo; // The new memo to update on the inventory transfer
  
      try {
        // Load the inventory transfer record
        var transferRecord = record.load({
          type: record.Type.TRANSFER_ORDER,
          id: transferId,
          isDynamic: true,
        });
  
        // Update the fields
        if (newLocation) {
          transferRecord.setValue('location', newLocation);
        }
        
        if (newMemo) {
          transferRecord.setValue('memo', newMemo);
        }
  
        // Save the updated record
        var transferRecordId = transferRecord.save({
          enableSourcing: true,
          ignoreMandatoryFields: true,
        });
  
        return {
          success: true,
          message: 'Transfer Order updated successfully.',
          updatedTransferId: transferRecordId,
        };
      } catch (e) {
        return {
          success: false,
          message: 'Error updating transfer order: ' + e.message,
        };
      }
    }
  
    // Define the POST method to update the inventory transfer
    function doPost(data) {
      return updateTransferOrder(data);
    }
  
    return {
      post: doPost,
    };
  });