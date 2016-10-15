using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactDemo.Models
{
   /**
    * CommentModel class is a data
    * model representation for comments.
    */
   public class CommentModel
   {
      /**
       * A comment has:
       *    a unique id (Id)
       *    an author (Author)
       *    the comment text
       *    itself (Text) 
       */
      public int Id { get; set; }
      public string Author { get; set; }
      public string Text { get; set; }
   }
}
