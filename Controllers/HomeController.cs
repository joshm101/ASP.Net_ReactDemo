using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactDemo.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactDemo.Controllers
{
   public class HomeController : Controller
   {
      private static readonly IList<CommentModel> _comments;
      
      static HomeController()
      {
         // List of comments, each represented
         // by our CommentModel class
         _comments = new List<CommentModel>
         {
            new CommentModel
            {
               Id = 1,
               Author = "Daniel Lo Nigro",
               Text = "Hello ReactJS.NET World!"
            },
            new CommentModel
            {
               Id = 2,
               Author = "Pete Hunt",
               Text = "This is one comment"
            },
            new CommentModel
            {
               Id = 3,
               Author = "Jordan Walke",
               Text = "This is *another* comment"
            },
         };
      }

      // GET: /<controller>/
      public IActionResult Index()
      {
         return View(_comments);  
      }

      [Route("comments")]
      [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
      // NoStore set to true prevents secondary storage of information.
      public IActionResult Comments()
      {
         return Json(_comments);
      }
      
      [Route("comments/new")]
      [HttpPost]
      // post a new comment to the server.
      public IActionResult AddComment(CommentModel comment)
      {
         // Create a fake ID for this comment
         comment.Id = _comments.Count + 1;
         _comments.Add(comment);
         return Content("Success :)");
      }
   }
}
