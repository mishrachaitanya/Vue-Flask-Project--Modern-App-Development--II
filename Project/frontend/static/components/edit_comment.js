const edit_comment={
    data(){
        return {

        }
    },
    template:`<body>
    <form method="POST">
        <div class="form-group"><h6><u>Old Comment:</u>&nbsp;{{old_comment}}</h6><br>
            <label for="exampleFormControlInput1"><u>Edit:</u></label>
            <input type="text" class="form-control" name="inputcomment" id="exampleFormControlInput1" placeholder="change comment">
                <input class="btn btn-primary" type="submit" value="Submit">
            </div>
        <!-- <label for="inputcomment">Edit:</label>
        <input type="text" id="inputcomment" name="inputcomment">
        <button type="submit">Change</button> -->
    </form><br>
    Changed your mind? <a href="/feed">click here</a>.
</body>`,
}
export default edit_comment