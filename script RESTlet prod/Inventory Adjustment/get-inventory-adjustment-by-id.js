/**
 * This SuiteScript RESTlet retrieves information about a specific Inventory Adjustment by internal ID,
 * including its line items.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'], function(search, record) {
    function getInventoryAdjustmentById(internalId) {
      var inventoryAdjustmentSearch = search.create({
        type: search.Type.INVENTORY_ADJUSTMENT,
        columns: ['internalid', 'tranid', 'trandate', 'memo', 'item', 'quantity'],
        filters: [
          ['internalid', 'is', internalId]
        ]
      });
  
      var inventoryAdjustmentData = [];
      inventoryAdjustmentSearch.run().each(function(result) {
        var adjustment = {
          internalid: result.getValue('internalid'),
          tranid: result.getValue('tranid'),
          trandate: result.getValue('trandate'),
          memo: result.getValue('memo'),
          lineItems: []
        };
  
        // Load the Inventory Adjustment record to access its line items
        var adjustmentRecord = record.load({
          type: record.Type.INVENTORY_ADJUSTMENT,
          id: result.getValue('internalid'),
          isDynamic: true
        });
  
        // Get available field IDs on the inventory sublist
        var inventorySublistFields = adjustmentRecord.getSublistFields({ sublistId: 'inventory' });
  
        // Retrieve line item details
        var lineItemCount = adjustmentRecord.getLineCount({ sublistId: 'inventory' });
        for (var i = 0; i < lineItemCount; i++) {
          var lineItem = {};
          // Populate the lineItem object with the retrieved fields
          for (var j = 0; j < inventorySublistFields.length; j++) {
            var fieldId = inventorySublistFields[j];
            lineItem[fieldId] = adjustmentRecord.getSublistValue({ sublistId: 'inventory', fieldId: fieldId, line: i });
          }
          adjustment.lineItems.push(lineItem);
        }
  
        inventoryAdjustmentData.push(adjustment);
        return false; // Stop the search after retrieving the first record
      });
  
      return inventoryAdjustmentData;
    }
  
    function doGet(context) {
      var internalId = context.internalId;
  
      if (!internalId) {
        throw new Error('Internal ID is required.');
      }
  
      var inventoryAdjustments = getInventoryAdjustmentById(internalId);
      return JSON.stringify(inventoryAdjustments);
    }
  
    return {
      get: doGet
    };
  });
  