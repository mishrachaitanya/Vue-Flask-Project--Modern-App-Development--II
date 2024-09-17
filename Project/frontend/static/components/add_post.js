const add_post = {
    data() {
      return {
        user: 'John Doe' // replace with actual user data
      }
    },
    template: `
    <body>
      <h2 style="float:left">Hello {{user}} </h2> <h2 style="float:right">Search|My Profile|Logout</h2>
      <br><br><br><br><br><br>
  
      <center>
        <form>
          <table>
            <tr>
              <td colspan="2"><h1 align="left">Add a post/blog</h1></td>
            </tr>
            <tr>
              <td>
                <label for="exampleFormControlInput1" class="form-label">Title</label>
              </td>
              <td>
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Title"/>
              </td>
            </tr>
            <tr>
              <td>
                <label for="exampleFormControlTextarea1" class="form-label">Description/Caption</label>
              </td>
              <td>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </td>
            </tr>
            <tr>
              <td>
                <label class="form-label" for="customFile">Select a file</label>
              </td>
              <td>
                <input type="file" class="form-control" id="customFile" />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <input class="btn btn-primary" type="submit" value="Submit">
              </td>
            </tr>
          </table>
        </form>
      </center>
    </body>
    `,
    style: `
   `,}



//    body {
//     height: 100vh;
//     background: linear-gradient(45deg, #e0d956, #ec6fb2);
//   }
  
//   h2 {
//     color: white;
//   }
  
//   h1 {
//     border-bottom: 2px solid #4e84ca;
//   }
  
//   form {
//     margin-top: 50px;
//     width: 500px;
//     background-color: white;
//     padding: 30px;
//     border-radius: 10px;
//   }
  
//   form input[type="text"],
//   form textarea,
//   form input[type="file"],
//   form input[type="submit"] {
//     margin-top: 10px;
//     width: 100%;
//     padding: 10px;
//     border: none;
//     border-radius: 5px;
//     box-sizing: border-box;
//   }
  
//   form input[type="submit"] {
//     background-color: #4e84ca;
//     color: white;
//     cursor: pointer;
//   }
  
//   form input[type="submit"]:hover {
//     background-color: #3c6fa2;
//   }
  export default add_post
