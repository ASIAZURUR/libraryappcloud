const express=require('express');
const authorsRouter=express.Router();
const Authordata=require('../model/Authordata');
const{ensureAuthorized}=require('../config/auth-admin')
const cloudinary=require('../cloudinary');
const dotenv=require('dotenv');
  dotenv.config();
function router(nav)
{
  
    authorsRouter.get('/', async function(req,res){
      let authors=  await Authordata.find()
      try {
        
         res.render("authors",
            {
                nav,
                title:'Library',
                authors
            });
        
          
      } catch (error) {
          console.log(error)
          
      }
       

        })
        authorsRouter.get('/:id',function(req,res){
            const id=req.params.id;
            Authordata.findOne({_id:id})
            .then(function(author){
                res.render('author',{
                    nav,
                    title:'Library',
                    author
                })
            })  
            })
           
            authorsRouter.get('/:id/delete',ensureAuthorized, async function(req,res){
                try {
                    let author=await Authordata.findById(req.params.id);
                    await cloudinary.uploader.destroy(author.cloudinary_id);
                    await author.remove();
                    res.redirect('/authors')
                } catch (error) {
                    console.log(error);
                }
         
             });
             authorsRouter.get('/delete/:id',ensureAuthorized, async function(req,res){
               
                 try {
                     let author=await Authordata.findById(req.params.id);
                     await cloudinary.uploader.destroy(author.cloudinary_id);
                     await author.remove();
                     res.redirect('/authors')
                 } catch (error) {
                     console.log(error);
                 }
             });
        return authorsRouter
    }
        module.exports=router;