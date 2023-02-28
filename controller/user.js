let constants = require('../config/constants');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');

let {User,Posts} = require('../config/collection');
const provider = new Web3.providers.HttpProvider(
    constants.HyperspaceRPC
);
 
const web3 = new Web3(provider);

const { create } = require('ipfs-http-client')
const ipfs = create(constants.ipfsURL) 

exports.verify = async (req, res) => {
    let signatureHex = req.body.signature;
    let address = req.body.address;
    let message = req.body.message;
    if(!signatureHex || !address || !message){
        res.json({status:false,message:''})
    }else{
        let recoveredAddress = web3.eth.accounts.recover(message, signatureHex);        
        if (recoveredAddress.toUpperCase() === address.toUpperCase()) { //verified
            let profile =  await _db.get().collection(User).findOne({address:address});
            console.log(profile);
            delete profile['id'];
            if(profile){
                res.json({
                    status: true,
                    data : profile,
                });
            }else{
                res.json({
                    status: true,
                    data : null,
                });
            }

          
        } else { //failed
          res.json({
            status: false,
            message:'Signature mismatch!'
          });
        }  
    }   

}


exports.checkHandle = async (req, res) => {
  try {
    let handle = req.params.handle;
  if (!handle) {
    res.json({ status: false, message: "" });
  } else {
    let availability = await _db
      .get()
      .collection(User)
      .findOne({ handle: handle});

    if (!availability) {
      res.json({
        status: true,
        message: "user handle available",
      });
    } else {
      res.json({
        status: false,
        message: "user handle is taken already!",
      });
    }
  }
  } catch (error) {
    console.log(error);
  }
};


exports.registerMember = async (req, res) => {
    let {
      firstName,
      lastName,
      handle,
      profilePictureUrl,
      displayName,
      bio,
      role,
      organization,
      skill,
      openForWork,
      address
    } = req.body;
    if (!firstName || !lastName || !handle || !profilePictureUrl || !displayName || !bio || !role || !organization || !skill || !openForWork || !address) {
        res.json({status:false, message:"Invalid params!", statusCode:400});
    } else  {
        // ipfs.add()
        let profile =  await _db.get().collection(User).findOne({address:address})
        console.log(profile);
        if(profile){
        res.json({status:false, message:"Profile exists!"});
        }else{
            let cid = await ipfs.add(Buffer.from(JSON.stringify(req.body)))
            console.log(cid);
            req.body['type'] = 'member';
            req.body['ipfs'] = cid.path;
            await _db.get().collection(User).insertOne(req.body);
            res.json({status:true,data:req.body ,message:""});
        }
        

    }


}


exports.registerTeam = async (req, res) => {
    let {
      organizationName,
      desc,
      handle,
      profilePictureUrl,
      website,
      contact,
      social,
      address
    } = req.body;
    console.log(req.body);

    if (!organizationName || !desc || !handle || !profilePictureUrl || !website || !contact || !social || !address) {
        res.json({status:false, message:"Invalid params!", statusCode:400});
    } else  {
        // ipfs.add()
        let profile =  await _db.get().collection(User).findOne({address:address})
        console.log(profile);

        if(profile){
        res.json({status:false, message:"Profile exists!"});
        }else{
            req.body['type'] = 'team';
            await _db.get().collection(User).insertOne(req.body);
            res.json({status:true,data:req.body ,message:""});       }
        

    }


}



exports.getProfile = async (req, res) => {
    let address = req.params.address;


    if (!address) {
        res.json({status:false, message:"Invalid params!", statusCode:400});
    } else {
    console.log(address);

    let profile =  await _db.get().collection(User).findOne({address:address})
    if(profile){
        delete profile['_id']
        res.json({status:true,data:profile ,message:""});
    }else{
        res.json({status:false ,message:"No profile found for the wallet!"});
    }

    }


}
