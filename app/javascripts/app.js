/**
 
 TRACEABILITY APP DEMO
 **/


var accounts;
var account;

web3.eth.getTransactionReceiptMined = function (txn, interval) {
    //console.log("waiting for transaction to complete...");
    var transactionReceiptAsync;
    interval |= 500;
    transactionReceiptAsync = function(txn, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txn);
            if (receipt == null) {
                setTimeout(function () {
                           transactionReceiptAsync(txn, resolve, reject);
                           }, interval);
            } else {
                console.log("transaction completed...");
                setStatus("transaction completed...");
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };
    
    return new Promise(function (resolve, reject) {
                       transactionReceiptAsync(txn, resolve, reject);
                       });
};


function setStatus(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
};

function createActivity(){
    var meta = Trace.deployed();
    
    var name = document.getElementById("activityName").value
    var id = parseInt(document.getElementById("activityId").value);
    var inputTru = parseInt(document.getElementById("inputTru").value);
    var outputTru = parseInt(document.getElementById("outputTru").value);

    setStatus("creating activity..." + name + " " + id + " " + inputTru + " " + outputTru);
    
    
    var ActivityCreated = meta.ActivityCreated({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    ActivityCreated.watch(function(error, result) {
                          if (error == null) {
                          console.log(result.args.msgOrder.toString(10) + " " + "PrimitiveActivity( id: " + result.args.activityId.toString(10) + ", name: " + result.args.description + ", tru_consumed: " + result.args.consumedTruId.toString(10) + ", tru_produced: " + result.args.producedTruId.toString(10) + " )");
                          return true;
                          }else{
                          console.log(error);
                          }
                          });

    
    meta.newPrimitiveActivity(name, id, inputTru, outputTru, {from: account, gas:3000000}).then(function(value) {
            web3.eth.getTransactionReceiptMined(value, 500);
            //console.log("returned from newPrimitiveActivity... txn:" + value);
            //console.log(value.valueOf());
            return true;
            }).catch(function(e) {
                     console.log("error from newPrimitiveActivity...");
                     console.log(e);
                     setStatus("Error newPrimitiveActivity; see log.");
                     return false;
                     });

}

function trace(){
    var meta = Trace.deployed();
    
  
    var fromTru = parseInt(document.getElementById("fromTru").value);
    var toTru = parseInt(document.getElementById("toTru").value);
    
    setStatus("PrimitiveTrace( from: " + fromTru + ", to: " + toTru + " )");
    console.log( "User initiated PrimitiveTrace( from: " + fromTru + ", to: " + toTru + " )");

    meta.primitiveTrace(fromTru, toTru, {from: account, gas:3000000}).then(function(value) {
           web3.eth.getTransactionReceiptMined(value, 500);
           //console.log("returned from primitiveTrace... txn:" + value);
           //console.log(value.valueOf());
           return true;
           }).catch(function(e) {
                    console.log("error from primitiveTrace...");
                    console.log(e);
                    setStatus("Error primitiveTrace; see log.");
                    return false;
                    });
}



window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

  });
    
    var meta = Trace.deployed();
    
    var TraceExists = meta.TraceExists({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    TraceExists.watch(function(error, result) {
                 if (error == null) {
                     console.log(result.args.msgOrder.toString(10) + " " + "trace_exists( from : " + result.args.from_tru.toString(10) + ", to: " + result.args.to_tru.toString(10) + " )");
                     return true;
                      }else{
                      console.log(error);
                      }
                 });
    
    var TraceDoesNotExist = meta.TraceDoesNotExist({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    TraceDoesNotExist.watch(function(error, result) {
                      if (error == null) {
                            console.log(result.args.msgOrder.toString(10) + " " + "trace_does_not_exist( from : " + result.args.from_tru.toString(10) + ", to: " + result.args.to_tru.toString(10) + " )");
                            return true;
                            }else{
                            console.log(error);
                            }
                      });
    var TruCreated = meta.TruCreated({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    TruCreated.watch(function(error, result) {
                          if (error == null) {
                          console.log(result.args.msgOrder.toString(10) + " " + "tru_produced( id: " + result.args.truId.toString(10)+ " )");
                          return true;
                     }else{
                     console.log(error);
                     }
                          });
    
    var TruConsumed = meta.TruConsumed({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    TruConsumed.watch(function(error, result) {
                        if (error == null) {
                        console.log(result.args.msgOrder.toString(10) + " " + "tru_consumed( id: " + result.args.truId.toString(10) + " , activity: " + result.args.activityName + " )");
                        return true;
                        }else{
                        console.log(error);
                        }
                        });
    
    var TruProducedBy = meta.TruProducedBy({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    TruProducedBy.watch(function(error, result) {
                     if (error == null) {
                     console.log(result.args.msgOrder.toString(10) + " " +"TRU " + result.args.currTru.toString(10) + " =>  " + result.args.activityName);
                     return true;
                        }else{
                        console.log(error);
                        }
                     });
    
    var ActivityConsumes = meta.ActivityConsumes({fromBlock: web3.eth.blockNumber, toBlock: 'latest'});
    ActivityConsumes.watch(function(error, result) {
                        if (error == null) {
                        console.log(result.args.msgOrder.toString(10) +": " + result.args.activityName + " => TRU " + result.args.currTru.toString(10) );
                        return true;
                           }else{
                           console.log(error);
                           }
                        });



}
