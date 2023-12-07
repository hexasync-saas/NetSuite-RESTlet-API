/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
    function createCustomerPayment(data) {
        var invoiceId = data.invoiceId; // The internal ID of the invoice
        var paymentMethodId = data.paymentmethod; // The internal ID of the payment method
        var paymentAmount = data.paymentAmount; // The payment amount
        var memo = data.memo;
        var custbody_scv_created_transaction = data.custbody_scv_created_transaction;
        var custbody_payment_ref_num = data.custbody_payment_ref_num;
        var customer = data.customer;
        var account = data.account;
        var cseg_scv_branch = data.cseg_scv_branch;
        var subsidiary = data.subsidiary;
        var location = data.location;
        var currency = data.currency; // Specify the currency

        // Transform the invoice into a customer payment
        var customerPayment = record.transform({
            fromType: record.Type.INVOICE,
            fromId: invoiceId,
            toType: record.Type.CUSTOMER_PAYMENT,
        });

        // Set customer payment fields
        customerPayment.setValue({
            fieldId: 'paymentmethod',
            value: paymentMethodId
        });
        customerPayment.setValue({
            fieldId: 'payment',
            value: paymentAmount
        });
        customerPayment.setValue({
            fieldId: 'memo',
            value: memo
        });
        customerPayment.setValue({
            fieldId: 'custbody_scv_created_transaction',
            value: custbody_scv_created_transaction
        });
        customerPayment.setValue({
            fieldId: 'custbody_payment_ref_num',
            value: custbody_payment_ref_num
        });
        customerPayment.setValue({
            fieldId: 'account',
            value: account
        });
        

        // Save the customer payment record
        var paymentId = customerPayment.save();

        return {
            success: true,
            paymentId: paymentId,
            invoiceId: invoiceId
        };
    }

    return {
        post: createCustomerPayment
    };
});
