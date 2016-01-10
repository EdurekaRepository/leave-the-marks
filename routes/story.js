var mongoose = require('mongoose');
var Story = mongoose.model('Story');


exports.stories=function(req,res){
             Story.find({}, function(err,stories){
                  res.render('home',{stories:stories,session:req.session});
              });
}

exports.addStory=function(req,res){

   var title=req.body.title;
   var content=req.body.content;
   var summary=req.body.summary;
   var imageLink=req.body.imageLink;

   var author =req.session.username;
   console.log("Author is :"+author);

   var newStory=new Story();
   newStory.author=author;
   newStory.title=title;
   newStory.content=content;
   newStory.summary=summary;
   newStory.imageLink=imageLink;

   var lowercaseTitle=newStory.title.toLowerCase();
   var slug=lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
   var addingHyphen=slug.replace(/\s+/g, '-');

   newStory.slug=addingHyphen;

   newStory.save(function(err,savedStory){
       if(err){
         console.log("Error : While registering new User");
         return res.status(500).send();
       }else{
         res.redirect("/stories");
       }
   });
}


exports.getStory=function(req,res){

   var url=req.params.story;
   console.log("Story URL :"+url);

   Story.findOne({slug:url}, function(err,story){
     console.log("Story Title :"+story.title);
        /*  res.render('story',{
                             title:story.title,
                             created_at:story.created_at,
                             content:story.content,
                             imageLink:story.imageLink
                           });*/



                           res.render('story',{
                                                story:story,session:req.session
                                              });
        });
}


exports.saveComment=function(req,res){
   var story_slug=req.params.slug;
   var comment=req.body.comment;
   var posted_date=new Date();
   console.log("Story  :"+story_slug+"  "+comment);

   Story.findOne({slug:story_slug}, function(err,story){
     console.log("Story Title :"+story.title);
        /*  res.render('story',{
                             title:story.title,
                             created_at:story.created_at,
                             content:story.content,
                             imageLink:story.imageLink
                           });*/
               story.comments.push({body:comment,commented_by:req.session.username,date:posted_date});

               story.save(function(err,savedStory){
                   if(err){
                     console.log("Error : While registering new User");
                     return res.status(500).send();
                   }else{
                     res.render('story',{story:story,session:req.session});
                   }
               });

        });
}
