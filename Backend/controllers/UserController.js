const db = require('../models/index.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtKey = "project";

const Project = db.project

// const check = async(req,res)=>{
//     res.send({data:"working..."});
//     console.log("asfsdgweghejwhghweghkwehgwhwhb");
// }
//1.create entry

const adduser = async (req,res)=>{
    // console.log(req);
    const pass = await bcrypt.hash(req.body.password,11);
    // console.log(pass);
    let info = {
        name : req.body.name,
        email : req.body.email,
        password : pass,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
    }
    console.log(info);
    const user = await Project.create(info);
    // res.status(200).send(user);
    jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
        // console.log(user,token);
        res.status(200).send({user,auth:token});
    })
}

//6 . Find user get method

const findUser = async (req,res) => {
    const ema = req.body.email;
    const password1 = req.body.password;

    let user = await Project.findOne({
        where:{email : ema}
    });

    const pass = user.password;
    if(password1)
    {
        const isMatch = await bcrypt.compare(password1,pass);
        // console.log(isMatch);
        if(isMatch)
        {
            jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                // console.log(user,token);
                res.status(200).send({user,auth:token});
            })
        }
        else{
            res.send({err : "wrong password provided"});
        }

    }else{
        res.send({err : "no password provided"});
    }

    // console.log(password1,pass);
}

//2. fetch data
const printUser = async (req,res) =>{
    console.log(req.params);
    console.log("req.boy=>",req.body);
    let user =await Project.findAll({})
    res.status(200).send(user)
}

//3. get one user
const getOneUser = async (req,res)=> {
    console.log("params=>",req.params);
    let user = await Project.findOne({ 
         where:{email : req.params.email}
    })

    res.status(200).send(user);
}


//4. update

const updatePrd = async (req,res) =>{
    let email = req.params.email;
    const user = await Project.update(req.body,{where :{email : email}});

    res.status(200).send(user);
}

//5. delete

const deletePrd = async (req,res) =>{
    let email = req.params.email;
    await Project.destroy({where : {email : email}});

    res.status(200).send("deleted");
}





module.exports = {
    adduser,
    printUser,
    getOneUser,
    updatePrd,
    deletePrd,
    findUser
}