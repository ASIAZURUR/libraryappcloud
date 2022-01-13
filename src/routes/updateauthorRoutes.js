const express = require('express');
const updateauthorRouter = express.Router();
const upload=require('../multer');
const cloudinary=require('../cloudinary')
const dotenv=require('dotenv');
  dotenv.config();


const Authordata = require('../model/Authordata');
function router(nav){
    updateauthorRouter.get('/',function(req,res){
        res.render('updateauthor',{
            nav,
            title:'Library'
        });
    });

    updateauthorRouter.get('/:id',function(req,res){
        const id = req.params.id;
        
        Authordata.findById(id,function(err,doc){
            if(!err){
                res.render('updateauthor',{
                    nav,
                    title:'Library',
                    author: doc 
                });
            }
            else{
                console.log(err);
            }
        });
    });

    
    updateauthorRouter.post('/:id',upload.single('image'), async function(req,res){
        try {
             let author= await Authordata.findById(req.params.id);
             await cloudinary.uploader.destroy(author.cloudinary_id);
             const result=await cloudinary.uploader.upload(req.file.path);
             const data={  name: req.body.name || author.name,
               books:req.body.books|| author.books,
               details:req.body.details ||author.details,
               image:result.secure_url || author.image,
              cloudinary_id:result.public_id ||author.cloudinary_id
   
             };
             author= await Authordata.findByIdAndUpdate(req.params.id,data,{new:true});
             res.redirect('/authors');
        } catch (error) {
            console.log(error)
        }
       })
    return updateauthorRouter;
}

module.exports = router;