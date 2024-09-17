const image_display={
    data(){
        return{

        }
    },
    template:`
    <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="row">
<div class="col-12 d-flex justify-content-center">
                <img src="data:image/jpeg;charset=utf-8;base64,{{ image_src }}" alt="Profile-Picture" class="img-fluid">
            </div>            
<div class="col-12 text-center mb-4">
                <a href="javascript:history.back()" class="btn btn-secondary">Go Back</a>
            </div>
            
        </div>
    </div>`,
}
export default image_display;