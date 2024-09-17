import datetime
from base64 import b64encode
from flask_restful import Resource, Api, reqparse
from flask import make_response, redirect, render_template, request, jsonify
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text
from models import *
import uuid
from flask_caching import Cache
from flask_cors import CORS
from datetime import timedelta, datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

############

CORS(app)

#############
api=Api(app)
# CORS(app)

cache=Cache(app,config={'CACHE_TYPE': 'simple'})

##CELERY
import workers
from tasks import expire_token
import tasks
celery=workers.celery_app
##


#############


@app.route('/')
def index():
    return render_template('index.html')

@app.before_request
def createDB():
    # db.drop_all()
    db.create_all()

parser = reqparse.RequestParser()
parser.add_argument('category_name', type = str, help = 'this is the updated name')

@app.route("/session_expired")
def expiredSession():
    return render_template('expire.html')



#################################################################################################################
import reports
import webhooks
class CheckIfValid(Resource):
    def post(self):



        return
app.config['JWT_SECRET_KEY'] = 'super-secret' 
jwt = JWTManager(app)
loggedinUser=''
class Login(Resource):
    def post(self):
        auth = request.authorization
        if auth:
            username = auth.get('username')
            password = auth.get('password')
            find = User.query.filter_by(username=username).first()
            print(username, password)
            if find:
                if check_password_hash(find.password, password):
                    token_expiration =timedelta(minutes=20)
                    access_token = create_access_token(
                        identity=username,
                        expires_delta=token_expiration)

                    dt = datetime.now() + timedelta(minutes=30)
                    formatted = dt.strftime('%Y-%m-%d %H:%M:%S')
                    token_expiration = datetime.strptime(formatted, '%Y-%m-%d %H:%M:%S')
                    find.token_expiration = token_expiration
                    find.token_valid= "true"
                    loggedinUser=username
                    db.session.commit()
                    # webhooks.send_reminder()
                    # reports.create_monthly_report_main()
                    # tasks.setup_periodic_tasks(celery)
                    # set_expiry_task(loggedinUser)

                    return {'access_token': access_token, 'token_expiration': token_expiration.timestamp()},200
                    
        return jsonify({"msg": "Bad username or password"}), 401
api.add_resource(Login, '/login')




def set_expiry_task(username):
    tasks.expire_token.delay(username)

    
class Protected(Resource):
    @jwt_required()
    def get(self):

        current_user = get_jwt_identity()
        if current_user:
            jj=User.query.filter_by(username=current_user).first()
            kk=jj.token_valid
            if kk=="true":
                return current_user,200
            else:
                return "You are not authorized", 301
        else:

            return "Something wrong", 400
    

class Logout(Resource):
    @jwt_required()
    def get(self):
        try:
            print("okok")
            current_user = get_jwt_identity()
            dt = datetime.now()
            formatted = dt.strftime('%Y-%m-%d %H:%M:%S')
            token_expiration = datetime.strptime(formatted, '%Y-%m-%d %H:%M:%S')
            ijk=User.query.filter_by(username=current_user).first()
            ijk.token_expiration = token_expiration
            ijk.token_valid="false"
            db.session.commit()
            return 'Success',200
        except:
            return "Something went wrong. Please try again", 500


api.add_resource(Protected, '/protected')
api.add_resource(Logout, '/logout')

#Validate User on fetch request
class Validity(Resource):
    @jwt_required()
    def get(self,username):
        # try:
        current_user=get_jwt_identity()
            # try:
        if username==current_user:
            jj=User.query.filter_by(username=current_user).first()
            kk=str(jj.token_valid)
            if kk=="True" or kk=="true":
                return "VALID", 200
        else:
            return "NOTVALID", 400


api.add_resource(Validity,'/valid_user/<string:username>')


############################################################
class Api_GetBlogs(Resource):
    def get(self,username):
        blog = Blogs.query.order_by(desc(Blogs.time)).all()
        # print(blog)

        blogs=[]
        obj={}
        for i in blog:
            # print(i.username)
            if i.username==username:
            # blogs[i.username]=i.blogid
            
                obj['title']=i.title
                obj['caption']=i.caption
                obj['time']=i.time
                obj['image']=i.image
                obj['blogid']=i.blogid
                obj['username']=i.username
                blogs.append(obj)
                obj={}
        
        return blogs,200

api.add_resource(Api_GetBlogs,'/api/blogs/<string:username>')
##########################################

class Api_Blogs(Resource):
    @cache.memoize(60)
    def get(self,username):
        # blog=Blogs.query.order_by(desc(Blogs.time)).all()
        blog = Blogs.query.filter_by(username=username).order_by(desc(Blogs.time)).all()
        print(blog)

        blogs=[]
        for i in blog:
            print(i)
            if i.username==username:
            # blogs[i.username]=i.blogid
                blogs.append(i)
        
        return blogs,200

    def get(self, blogid):
        i=Blogs.query.filter_by(blogid=blogid).first()
        print(i)
        if i:
            
            return {"title":i.title,"caption":i.caption,
                "image":i.image,"time":i.time,"username":i.username}
        else:
            return "Blog Not Found", 404

    def put(self, blogid):
        this_blog = Blogs.query.get(blogid)
        data = request.get_json()
        db.session.commit()
        return "Success", 200

    def delete(self, blogid):
        this_blog = Blogs.query.get(blogid)
        if this_blog:
            db.session.delete(this_blog)
            db.session.commit()
            return 'Deleted successfully', 200
        else:
            return 'Not found', 404
    @cache.memoize(60)    
    def post(self):
        title = request.form['title']
        caption = request.form['caption']
        username = request.form['username']
        users=User.query.all()
        for i in users:
            if i.username==username:
                c=1
        if c!=1:
            return "Username not found",401
        file = request.files['image']
        filename = file.filename
        file_ext = os.path.splitext(filename)[1]
        new_filename = str(uuid.uuid4()) + file_ext
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        # Save the filename, first_name, last_name, and username to the database
        # ...
        image=new_filename
        new_blog=Blogs(username=username,caption=caption,
        image=image,time=datetime.now(),title=title)

        db.session.add(new_blog)
        db.session.commit()
        return 'Blog added', 200
    
api.add_resource(Api_Blogs,'/api/blogs/<string:username>' ,'/api/blog/<int:blogid>','/api/blog','/api/blog/')
############################
class Edit_Title(Resource):
    def put(self,blogid):
        this_blog = Blogs.query.get(blogid)
        data = request.get_json()
        this_blog.title=data['title']
        db.session.commit()
        return "Success", 200
api.add_resource(Edit_Title,'/api/edit_title/<int:blogid>' )

class Edit_Caption(Resource):
    def put(self, blogid):
        this_blog = Blogs.query.get(blogid)
        data = request.get_json()
        this_blog.caption=data['caption']
        db.session.commit()
        return "Success", 200
api.add_resource(Edit_Caption,'/api/edit_caption/<int:blogid>' )
###############################################################################################################

class API_PIDs(Resource):
    def get(self):
        posts=Posts.query.all()
        kl={}
        for i in posts:
            kl[i.author]=[]
        for i in posts:
            kl[i.author].append(i.pid)
        return kl
api.add_resource(API_PIDs,'/api/postid')

###############################

class Api_Posts(Resource):
    # @cache.memoize(60)
    def get(self, id):
        #print("HIHIHI")
        all_blogs=Posts.query.all()
        c=0
        for i in all_blogs:
            if i.pid==id:
                c=1
                return {"comment":i.comment,"liked_by":i.likes,"author":i.author}
        return 'Blog not found', 404
    
    def put(self, id):

        create_post_parser=reqparse.RequestParser()
        create_post_parser.add_argument('comment')
        create_post_parser.add_argument('like')
        create_post_parser.add_argument('author')
        create_post_parser.add_argument('post_id')

        

        args=create_post_parser.parse_args()
        c=0
        args_comment = args.get('comment')
        args_likes = args.get('like')
        args_author = args.get('author')
        for i in User.query.all():
            if args_author==i.username:
                c=1
        if args_author=='' or c==0:
            return 'Invalid input', 304
        
        this_blog=Posts.query.filter_by(post_id=id)
        #print(this_blog, args_author)
        if this_blog:
            this_blog.comment=args_comment
            this_blog.likes=args_likes
            this_blog.author=args_author
            db.session.commit()
            return 'Sucessfully updated', 201  
        else:
            return 'Post not found',404
    def post(self,id):
        create_post_parser=reqparse.RequestParser()
        create_post_parser.add_argument('comment')
        create_post_parser.add_argument('liked_by')
        create_post_parser.add_argument('author')
        # create_post_parser.add_argument('post_id')

        c=0
        args=create_post_parser.parse_args()
   
        args_comment = args.get('comment')
        args_likes = args.get('like')
        args_author = args['author']
        d=0
        print(args_author,'lll')
        for i in User.query.all():
            if i.username==args_author:
                c=1
        for i in Blogs.query.all():
            if i.blogid==id:
                d=2
        if args_author==''or c==0 or d==0:
            return 'Invalid input', 405
        
        new_post=Posts(post_id=id,comment=args_comment,author=args_author,likes=args_likes)
        db.session.add(new_post)
        db.session.commit()
        return 'Post added successfully', 200


    def delete(self, id):
        this_post = Posts.query.get(id)
        
        if this_post:
            db.session.delete(this_post)
            db.session.commit()

            return 'Post Deleted', 200
        else:
            return 'Post not found', 404

api.add_resource(Api_Posts,'/api/posts' ,'/api/posts/<int:id>')
##############################
class Likes(Resource):
    def get(self,postid):
        blog=Posts.query.filter_by(post_id=postid).all()
        likedBy=[]
        user=User.query.all()
        data=[]
        try:
            for i in blog:
                likedBy.append(i.likes)
            for i in user:
                if i.username in likedBy:
                    obj={
                        "username":i.username,
                        "first_name":i.first_name,
                        "last_name":i.last_name
                    }
                    data.append(obj)
            
            return data,200
        except:
            return "NO",301

    def post(self,postid):
        user=request.form['author']
        blog=Posts.query.filter_by(post_id=postid).all()
        for i in blog:
            if i.likes==user:
                return "ALREADY_LIKED",300
        new_post=Posts(post_id=postid, comment='',
                       likes=user,author=blog.author)
        db.session.add(new_post)
        db.session.commit()
    
    def delete(self,postid):
        user=request.form['author']
        blog=Posts.query.filter_by(post_id=postid).all()
        c=0
        for i in blog:
            if i.likes!=user:
                c=1
        if c==1:
            return "LIKEFIRST",300
        for i in blog:
            if i.likes==user:
                if i.comment=='':
                    db.session.delete(i)
                else:
                    i.likes=''
        db.session.commit()
api.add_resource(Likes,'/api/like/<int:postid>')

class Comment(Resource):
    # @cache.memoize(60)
    def get(self, postid):
        post=Posts.query.filter_by(post_id=postid).all()
        users=User.query.all()

        # comment_user=[]
        comments=[]
        for i in post:
            for j in users:
                if i.author==j.username:
                    obj={
                        "comment":i.comment,
                        "author":i.author,
                        "first_name":j.first_name,
                        "last_name":j.last_name,
                        "dp":j.profile_photo,
                        "post_id":i.post_id
                    }
                    comments.append(obj)
        return comments,200
    
    def post(self,postid):
        username=request.form['author']
        comm=request.form['comment']
        print(comm,username)
        post=Posts(post_id=postid, comment=comm,
                  author=username)
    
        db.session.add(post)
        db.session.commit()
        return "OK",200
    def put(self,postid):
        username=request.form['author']
        new_comm=request.form['comment']
        post=Posts.query.filter_by(post_id=postid).all()
        for i in post:
            if i.author==username:
                i.comment=new_comm
                break
        db.session.commit()
        return "OK",200
    def delete(self,postid):
        username=request.form['author']
        post=Posts.query.filter_by(post_id=postid).first()
        
        db.session.delete(post)
               
        db.session.commit()
        return "OK",200

api.add_resource(Comment,'/api/comment/<int:postid>')

class LikeDislike(Resource):
    def post(self,blogid):
        posts=Posts.query.filter_by(post_id=blogid).all()
        author=request.form['author']
        for i in posts:
            if (i.likes==author):
                return "ALREADYLIKED",403
        new_like=Posts(post_id=blogid, comment='',likes=author,author='')
        db.session.add(new_like)
        db.session.commit()
        return "SUCCESS",200

    
    
api.add_resource(LikeDislike, '/api/like_post/<int:blogid>')

class DislikePost(Resource):
    def post(self,blogid):
        posts=Posts.query.filter_by(post_id=blogid).all()
        author=request.form['author']
        print("AUTHOR:",author)
        c=0
        for i in posts:
            if i.likes==author:
                c=1
                if i.comment!='':
                    i.likes=''
                    print("here")
                else:
                    db.session.delete(i)
                    print('there')
        print(c)
        print("AJKOADFD",author)
        db.session.commit()
        if c!=1:
            return "LIKEFIRST",400
        return "SUCESS",200
api.add_resource(DislikePost, '/api/dislike_post/<int:blogid>')

#######################################################################################################
app.config['UPLOAD_FOLDER'] =  os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static/uploads')
class Add_User(Resource):
    def post(self):
        fname = request.form['first_name']
        lname = request.form['last_name']
        username = request.form['username']
        about_me=request.form['about_me']
        password=generate_password_hash(request.form['password'],method='SHA256')
        ##
        file = request.files['image']
        filename = file.filename
        file_ext = os.path.splitext(filename)[1]
        new_filename = str(uuid.uuid4()) + file_ext
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        # Save the filename, first_name, last_name, and username to the database
        # ...
        profile_photo=new_filename
        new_user=User(username=username, first_name=fname, last_name=lname,
                    about_me=about_me,password=password,profile_photo=profile_photo)
        print(new_user)
        db.session.add(new_user)
        db.session.commit()
        return 'File uploaded successfully', 200
    
api.add_resource(Add_User,'/add_user')

class CheckValid(Resource):
    def get(self,username):
        new=User.query.filter_by(username=username).first()
        if new:
            if new.token_valid == "true":
                return "Valid",200
            else:
                return "InValid", 301
        else:
            return "User not found", 400
api.add_resource(CheckValid,'/check_token/<string:username>')

#################################################

class GetAllUsers(Resource):
    def post(self):
        user_ids = request.get_json().get('user_ids')
        obj=[]
        # print(user_ids,'PPRIASFJASKFJHKAFHJKAFNS')
        
        for user_id in user_ids:
            if user_id !='':
                # print("HEHEHEHEHEHEHE")
                print(user_id,'UUUSERRRID')
                new=User.query.filter_by(username=user_id).first()
                # print(new.username,'fasgfjhasgfjkasf')
                newObj={"username": new.username,
                        "first_name":new.first_name,
                        "last_name":new.last_name}
                obj.append(newObj)
                print(obj)
        print(obj,'OOJJJBBB')
        return obj,201
        # except:
        #     return "ERROR",304
api.add_resource(GetAllUsers, '/api/all_users_info/')

##############################

class All_Users(Resource):
    def get(self):
        kk=User.query.all()
        ll=[]
        for i in kk:
            ll.append(i.username)
        return ll,200
api.add_resource(All_Users,'/api/all_users/')

class Api_Users(Resource):
    def get(self,username):
        this_user=User.query.filter_by(username=username).first()

        if this_user:
            return {"first_name":this_user.first_name,"last_name":this_user.last_name,
            "username":this_user.username,"profile_photo":this_user.profile_photo,
             "ID":this_user.id,"about_me":this_user.about_me}
        else:
            return 'User not found',304
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('first_name')
        parser.add_argument('password')
        parser.add_argument('profile_photo')
        parser.add_argument('about_me')
        parser.add_argument('last_name')
      
        args=parser.parse_args()
        args_uname=args['username']
        
        if not (args_uname or len(args_uname)<6):
            return 'Username needs to be atleast 6 characters long', 304 
        
        args_fname=args['first_name']
        if len(args_fname)==0:
            return 'First Name required', 304
        
        args_lname=args.get('last_name')
        args_password=args.get('password')
        if len(args_password)<6:
            return 'Password too short', 304
        hashed_p=generate_password_hash(args_password, method='SHA256')

        args_dp=args.get('profile_photo')
        args_mimetype=args.get('about_me')

        new_user=User(username=args_uname,password=hashed_p,
        first_name=args_fname,last_name=args_lname,
        profile_photo=args_dp,about_me=args_mimetype)

        db.session.add(new_user)
        db.session.commit()
        return 'User added Successfully', 200
        
    def put(self,username):
        create_user_parser= reqparse.RequestParser()
        args=create_user_parser.parse_args()
        user=User.query.filter_by(username=username).first()
        args_fname=request.form['first_name']
        args_lname=request.form['last_name']
       

        file = request.files['image']
        filename = file.filename
        file_ext = os.path.splitext(filename)[1]
        new_filename = str(uuid.uuid4()) + file_ext
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        user.profile_photo=new_filename

        args_about_me=request.form['about_me']
        user.first_name= args_fname
        user.last_name=args_lname
        user.about_me=args_about_me

        db.session.commit()
        return 'User updated successfully',200

    def delete(self,username):
        abc,all_ids,pos=[],[],[]
        user=User.query.filter_by(username=username).first()
        for i in Blogs.query.all():
                if i.username==username:
                    abc.append(i)
                    all_ids.append(i.blogid)
        for i in Posts.query.all():
            if i.post_id in all_ids:
                pos.append(i)
        
        if user:
            for i in pos:
                db.session.delete(i)
                db.session.commit()
            for i in abc:
                db.session.delete(i)
                db.session.commit()
            db.session.delete(user)
            db.session.commit()
            return 'User deleted',201
        else:
            return 'user not found', 404
api.add_resource(Api_Users,'/api/users/' ,'/api/users/<string:username>')

user_info_parser=reqparse.RequestParser()
user_info_parser.add_argument('followers')
user_info_parser.add_argument('following')
user_info_parser.add_argument('username')

class Api_User_info(Resource):


    def get(self,username):
        us1=User.query.all()
        d=0
        for i in us1:
            if i.username==username:
                d=1
        print(d)
        if d==1:
            us=User_info.query.all()
            dictf={'following':[],'followers':[]}
            c=0
            
            for i in us:
                if i.username==username:
                    c=1
                    if i.followers=='':
                        dictf['following'].append(i.following)
                    elif i.following=='':
                        dictf['followers'].append(i.followers) 
            if c==1:
                return dictf,200
            else:
                return dictf, 201
        else:
            return "No user with that Name.", 402

    #Follow
    def post(self):
        print("HERERE")
        info_parser=reqparse.RequestParser()
        info_parser.add_argument('username1',help="Current_user")
        info_parser.add_argument('username2', help='Both cannot be same')
        following_list=[]
        
        args=info_parser.parse_args()
        username1=args['username1']
        k=User_info.query.all()
        username2=args['username2']
        for i in k:
            if i.username == username1 and i.following == username2:
                return "FOLLOWING", 400



        if username1!='' and username2!='':
            add1=User_info(followers='',following=username2,username=username1)
            add2=User_info(followers=username1, following='',username=username2)

            db.session.add(add1)
            db.session.add(add2)
            db.session.commit()

            return 'Success',201
        else:
            return 'Invalid Input', 404

    #Delete will have followers/following to following/followers effect on two user
    #Delete-Unfollow
    def delete(self):

        info_parser=reqparse.RequestParser()
        info_parser.add_argument('username1',help="Current_user")
        info_parser.add_argument('username2', help='Both cannot be same')

        args=info_parser.parse_args()
        username1=args['username1']
        username2=args['username2']

        c=0

        mainu=User_info.query.filter_by(username=username1).all()
        for i in mainu:
            if username2==i.following:
                c=1
                db.session.delete(i)
                break
        deleted=User_info.query.filter_by(username=username2).all()
        for i in deleted:
            if username1==i.followers:
                db.session.delete(i)
        
        db.session.commit()
        if c!=0:
            return 'Done',201
        else:
            return 'NOTFOUND',400
    
api.add_resource(Api_User_info,'/api/user_info' ,'/api/user_info/<string:username>')

class ChangePassword(Resource):
    def put(self,username):
        user=User.query.filter_by(username=username).first()
        existing_password=user.password
        old_password=request.form['old_password']
        new_password=request.form['new_password']
        old_p=check_password_hash(existing_password,old_password)

        if (old_p):
            new_p=generate_password_hash(new_password,method='SHA256')
            user.password=new_p
            db.session.commit()
            return "Successful",200
        
        elif(old_p==False):
            return "NOMATCH", 400
        return "Something went wrong",500
api.add_resource(ChangePassword,'/api/change_password/<string:username>') 

class CheckPassword(Resource):
    def delete(self,username):
        
        user=User.query.filter_by(username=username).first()
        print(user)
        pass1=user.password
        new_pass=request.form['password']
        password=check_password_hash(pass1,new_pass)
        print(password)
        blogs=Blogs.query.all()
        User_info1=User_info.query.all()
        if (password):
            abc,all_ids,pos=[],[],[]
            for i in Blogs.query.all():
                    if i.username==username:
                        abc.append(i)
                        all_ids.append(i.blogid)
            for i in Posts.query.all():
                if i.post_id in all_ids:
                    pos.append(i)
            
            if user:
                for i in pos:
                    db.session.delete(i)
                    db.session.commit()
                for i in abc:
                    db.session.delete(i)
                    db.session.commit()
                db.session.delete(user)
                db.session.commit()
                return 'YES',200
            else:
                return 'user not found', 404
        
api.add_resource(CheckPassword,'/api/delete/<string:username>')
#######################################################


class UserSearch(Resource):
    def get(self, search_query):
        query = text("""
            SELECT first_name, last_name, username 
            FROM user_search 
            WHERE first_name LIKE :query
            OR last_name LIKE :query
            OR username LIKE :query
            """)
        result = db.session.execute(query, {'query': f'%{search_query}%'})
        obj=[]
        for i in result:
            k={
                'first_name':i.first_name,
                'last_name': i.last_name,
                'username':i.username
            }
            obj.append(k)
            k={}

        return obj,200

api.add_resource(UserSearch, '/api/user_search/<string:search_query>')



class All_Posts_by_Followers(Resource):
    # @cache.memoize(300)
    def post(self):
        users = request.form['names']
        list_of_blogs = []
        print(users,'jgf')
        k=[]
        all_blogs = Blogs.query.order_by(desc(Blogs.time)).all()
        userinfos=User_info.query.filter_by(username=users).all()
        for i in userinfos:
            k.append(i.following)
        print(k)
        for i in all_blogs:
            if i.username in k:
                use = User.query.filter_by(username=i.username).first()
                obj = {
                    "blogid": i.blogid,
                    "title": i.title,
                    "caption": i.caption,
                    "time": i.time,
                    "username": i.username,
                    "image": i.image,
                    "first_name": use.first_name,
                    "last_name": use.last_name,
                    "dp":use.profile_photo,
                }
                list_of_blogs.append(obj)

        return list_of_blogs, 200

api.add_resource(All_Posts_by_Followers, '/api/get_all_posts')

# Taking users as a list
class UserListDetails(Resource):
    def post(self):
        following = request.json.get('names', [])
        users=User.query.all()
        following_list=[]
        for i in users:
            if i.username in following:
                obj={
                    'first_name':i.first_name,
                    'last_name':i.last_name,
                    'username':i.username
                }
                following_list.append(obj)
    
        return following_list,200
api.add_resource(UserListDetails, '/api/following_details')

#######################################################
from webhooks import send_export_file
class Export_File(Resource):
    def get(self,blogid,email):
        send_export_file(blogid,email)
        return "",200


api.add_resource(Export_File, '/export_file/<int:blogid>/<string:email>')

###########################################
import csv
class CSVUpload(Resource):
    def post(self):
        file = request.files.get('file')

        if not file:
            return {'error': 'No file uploaded'}, 400

        if file.mimetype != 'text/csv':
            return {'error': 'Invalid file format'}, 400
        print(type(file))
        data = []
        reader= csv.reader(file.stream.read().decode('utf-8').splitlines())
        # reader = csv.reader(file.stream)
        # print(reader)
        next(reader)  # Skip the header row
        time=datetime.now()
        
        for row in reader:
            if len(row) != 4:
                continue  # Skip invalid rows

            title = row[0]
            caption = row[1]
            image = row[2]
            username=row[3]
            data.append({'image': image, 'title': title, 'caption': caption})
            blog=Blogs(username=username,title=title,caption=caption,time=time,image=image)
            db.session.add(blog)
            db.session.commit()
        return "Success", 200


api.add_resource(CSVUpload,'/api/csv_upload/')









if __name__=='__main__':

    app.run(debug=True)

    # app.debug=True