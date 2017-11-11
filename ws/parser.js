var db = require('./db');

var parseMessage = function(message,idClient){
    try{
        var object = JSON.parse(message);
        console.log(message);
    }
    catch(err){
        console.error(err);
        return;
    }

    switch(object.Table){
            
            
        case "messages":
            switch(object.Type)
            {
                 case "SELECT": SelectMessages(object,idClient); break; 
                 default: console.error("error parse type",object.Type); break;
            }
            break; //case "messages"
            
            
            
            
        case "devices":
            switch(object.Type)
            {
                 case "SELECT": SelectDevices(object,idClient); break; 
                 default: console.error("error parse type",object.Type); break;
            }
            break; //case "devices"
            
            
            
        default: console.error("error parse Table",object.Table); break;
    }

}
module.exports.parseMessage = parseMessage;
            

//Messages +
var SelectMessages = function(object,idClient){
    switch(object.Mode){
        case "IdDeviceArray":  
            db.selectQuery("SELECT * FROM messages "+
             generateWhere(object.Values,"id_dev")+
             " LIMIT "+object.Limit,
                    idClient,
                    object.IdMessage);
        break;
        default: console.error("error parse mode",object.Mode); break;
    }                     
}
//Messages -

//Devices +
var SelectDevices = function(object,idClient){
    switch(object.Mode){
        case "IdUsersArray":  
            db.selectQuery("SELECT * FROM devices "+
             generateWhere(object.Values,"id_user")+
             " LIMIT "+object.Limit,
                    idClient,
                    object);
        break;
        default: console.error("error parse mode",object.Mode); break;
    }                     
}
//Devices -                    

      
var generateWhere = function(arrayId,columnName){
    if(arrayId.length > 0)
        {
            var whereSTR = " WHERE ";
            for(var i =0; i<arrayId.length; i++){
                    whereSTR += columnName + " = " + arrayId[i];
                    if(i+1 < arrayId.length)
                         whereSTR += " OR ";  
            }
            return whereSTR;
        }
    return "error generateWhere";
}

                    
                    
//
//    var message_toserver = {
//        IdMessage: counterMessage++,
//        Table: "messages",
//        Mode: "IdDevice",
//        Values: outgoingMessage,
//        Type: "SELECT",
//        Limit: 100
//    }
