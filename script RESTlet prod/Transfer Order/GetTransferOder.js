/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/search'], function (search) {

    function getTransferOrderByOrderNumber(custbody_scv_inv_po) {
      // Define search filters and columns to retrieve the desired data
      //log.debug('doGet', 'refNm: ' + refNum); // Log  data
      log.debug("sapo number: ", custbody_scv_inv_po);
      var inventoryTransferSearch = search.create({
        type: search.Type.TRANSFER_ORDER,
        filters: [['custbody_scv_inv_po', 'is', custbody_scv_inv_po]], // Search by custbody_scv_inv_po
        columns: ['internalId', 'tranid', 'trandate', 'transferlocation', 'location', 'department', 'externalid', 'lastmodifieddate', 'exchangerate', 'postingperiod', 'subsidiary', 'total', 'transferlocation', 'custbody_scv_inv_po', 'customform', 'incoterm', 'status', 'item'] // Add more columns as required
      });
      // log.debug('doGet', 'inventoryTransferSearch: ' + inventoryTransferSearch); // Log  data
      log.debug("inventoryTransferSearch: ", JSON.stringify(inventoryTransferSearch));
      log.debug("item: ", JSON.stringify(inventoryTransferSearch));
      var inventoryTransferData = [];
      inventoryTransferSearch.run().each(function (result) {
        var transfer = {
  
          internalId: result.getValue('internalid'),
          tranid: result.getValue('tranid'),
          transferDate: result.getValue('trandate'),
          transferLocation: result.getValue('transferlocation'),
          location: result.getValue('location'),
          total: result.getValue('total'),
        //  class: result.getValue('class'),
        //  custbody_sapo_number: result.getValue('custbody_sapo_number'), 
          custbody_scv_inv_po: result.getValue('custbody_scv_inv_po'),
          customform: result.getValue('customform'),
          incoterm: result.getValue('incoterm'),
          status: result.getValue('status'),
          item: result.getValue('item'),
          exchangerate: result.getValue('exchangerate')
          // Add more fields as required
        };
        
        //log.debug('doGet', 'PO: ' + JSON.stringify(result));
        inventoryTransferData.push(transfer);
        return true; // Continue processing additional search results
      });
        log.debug("inventoryTransferData: ", JSON.stringify(inventoryTransferData));
  
      // log.debug('doGet', 'inventoryTransferData: ' + inventoryTransferData); // Log  data
  
      return inventoryTransferData;
    }
  
    function doGet(context) {
      var custbody_scv_inv_po = context.custbody_scv_inv_po;
  
      // Check if refNum is provided
      if (!custbody_scv_inv_po) {
        throw new Error('Reference number is required.');
      }
  
      var inventoryTransfers = getTransferOrderByOrderNumber(custbody_scv_inv_po);
      // Check if any inventory transfers are found
      if (inventoryTransfers.length === 0) {
       // throw new Error('Inventory Transfer not found.');
        return JSON.stringify([]);
      }
  
      return JSON.stringify(inventoryTransfers)
    }
  
    return {
      get: doGet
    };
  });
  
  
  
  
  
  