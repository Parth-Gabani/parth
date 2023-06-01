const express = require('express')
const router = express.Router()
const { con } = require('../db/db')

const get_data = async(req,res,next) =>{
    var type = req.query.type
    var search_query = req.query.parent_value;
    console.log(type);

    if(type == 'load_subcategory')
    {
        var query = "SELECT scname FROM subcategory WHERE subcategory='"+search_query+"'"
    }
    
    con.query(query,function(err,data2){
        
        var data_arr = []
        data2.forEach(function(row){
            data_arr.push(row.Data)
        })
        res.json(data_arr)
    })
}

module.exports = {get_data}