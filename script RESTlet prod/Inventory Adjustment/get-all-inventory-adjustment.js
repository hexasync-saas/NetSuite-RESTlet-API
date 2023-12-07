/**
 * This SuiteScript RESTlet retrieves information about Inventory Adjustment records.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'], function(search) {
    function getInventoryAdjustments() {
      var inventoryAdjustmentSearch = search.create({
        type: search.Type.INVENTORY_ADJUSTMENT,
        columns: ['internalid', 'tranid', 'trandate', 'memo']
      });
  
      var inventoryAdjustmentData = {};
      
      var startIndex = 0;
      var searchResults = inventoryAdjustmentSearch.run().getRange({ start: startIndex, end: startIndex + 999 });
      while (searchResults.length > 0) {
        searchResults.forEach(function(result) {
          var adjustment = {
            internalid: result.getValue('internalid'),
            tranid: result.getValue('tranid'),
            trandate: result.getValue('trandate'),
            memo: result.getValue('memo')
          };
  
          // Use internalid as a key to avoid duplicates
          inventoryAdjustmentData[adjustment.internalid] = adjustment;
        });
        
        startIndex += 1000;
        searchResults = inventoryAdjustmentSearch.run().getRange({ start: startIndex, end: startIndex + 999 });
      }
  
      // Convert object values to an array of records
      var inventoryAdjustments = [];
      for (var key in inventoryAdjustmentData) {
        if (inventoryAdjustmentData.hasOwnProperty(key)) {
          inventoryAdjustments.push(inventoryAdjustmentData[key]);
        }
      }
  
      return inventoryAdjustments;
    }
  
    function doGet() {
      var inventoryAdjustments = getInventoryAdjustments();
      return JSON.stringify(inventoryAdjustments);
    }
  
    return {
      get: doGet
    };
  });