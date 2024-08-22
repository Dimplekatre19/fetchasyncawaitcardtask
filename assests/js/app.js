const cl= console.log;
const postcontainer=document.getElementById("postcontainer");
const postform=document.getElementById("postform")
const titlecontrol=document.getElementById("titleId");
const contentcontrol=document.getElementById("contentId");
const userIdcontrol=document.getElementById("userId");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");
const loader=document.getElementById("loader");


const BASE_URL="https://xhraa-db410-default-rtdb.firebaseio.com"
const POST_URL=`${BASE_URL}/posts.json`;

const sweetalert=(msg,icon)=>{
     Swal.fire({
          title:msg,
          timer:2500,
          icon:icon
     })  
}


const templating=(arr)=>{
     let result=``;
     arr.forEach(post => {
            result+=`
            <div class="col-md-6 offset-md-3">
               <div class="card mb-4" id="${post.id}">
                    <div class="card-header">
                       <h3>${post.title}</h3>
                    </div>
                    <div class="card-body">
                       <p>${post.body} </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                      <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                    </div>
                  </div>
                  </div>
            `
            postcontainer.innerHTML=result;
            sweetalert("POST IS FETCHED SUCCESSFULLYY","success")
     });    
}

const objtoarr=(obj)=>{
     let postarr=[];
     for(const key in obj){
          postarr.unshift({...obj[key], id:key})
     }
     return postarr;
}

const makeapicall=async(methodname,apiurl,msgbody)=>{
     try{

          loader.classList.remove("d-none")
          msgbody=msgbody?JSON.stringify(msgbody):null; 
         let res= await fetch(apiurl,{
             method:methodname,
             body:msgbody,
             headers:{
                   token:"JWT TOKEN FROM LS"
             }
          })
          return  res.json()
     }catch(err){
            sweetalert(err,"error")
     }finally{
           loader.classList.add('d-none')
     }
    
     //cl(res);
}

const fetchpost=async()=>{
     try{
          let data=await makeapicall("GET",POST_URL);  
          //cl(data);  
           let arr= objtoarr(data); 
           //cl(arr);
           templating(arr);  
          
     }catch(err){
           sweetalert(err,"error")
     }
 
}
fetchpost();

const onpostadd=async(eve)=>{
     eve.preventDefault()

          let newpost={
               title:titlecontrol.value,
               body:contentcontrol.value,
               userId:userIdcontrol.value
           } 
           cl(newpost);
           postform.reset();
        let data= await makeapicall("POST",POST_URL,newpost);
        cl(data);
        newpost.id=data.name;
        let div=document.createElement("div");
        div.className="col-md-6 offset-md-3"
        div.innerHTML=`
          <div class="card mb-4" id="${newpost.id}">
                         <div class="card-header">
                           <h3>${newpost.title}</h3>
                        </div>
                        <div class="card-body">
                           <p>${newpost.body} </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                          <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                        </div>
                      </div>
        
        `
          postcontainer.prepend(div);
          sweetalert("POST IS ADDED SUCCESSFULLYY!!!","success");

}

const onEdit=async(ele)=>{
      let EDIT_ID=ele.closest(".card").id;
      localStorage.setItem("EDITID",EDIT_ID)
      ;//cl(EDIT_ID);
      const EDIT_URL=`${BASE_URL}/posts/${EDIT_ID}.json`
    let data=await  makeapicall("GET",EDIT_URL);
    cl(data);
    titlecontrol.value=data.title;
    contentcontrol.value=data.body;
    userIdcontrol.value=data.userId;
    submitbtn.classList.add("d-none");
    updatebtn.classList.remove("d-none");
    window.scrollTo({top:0,behavior:"smooth"})

}

const onpostupdate=async()=>{
     let UPDATE_ID=localStorage.getItem('EDITID');
     //cl(UPDATE_ID);
     let UPDATE_URL=`${BASE_URL}/posts/${UPDATE_ID}.json`;
     let updatedobj={
           title:titlecontrol.value,
           body:contentcontrol.value,
           userId:userIdcontrol.value,
     }
     postform.reset();
     let data= await makeapicall("PATCH",UPDATE_URL,updatedobj)
     let card=[...document.getElementById(UPDATE_ID).children]
     //cl(card);
     card[0].innerHTML=` <h3>${updatedobj.title}</h3>`;
     card[1].innerHTML=`<p>${updatedobj.body} </p>`
     submitbtn.classList.remove("d-none");
     updatebtn.classList.add("d-none")
     sweetalert("POST IS UPDATED SUCCESSFULLYY!!!","success");
}

const onDelete=async(ele)=>{
     let removeId= ele.closest(".card").id;
     let REMOVE_URL=`${BASE_URL}/posts/${removeId}.json`;
     try{
        let getconfirmed=await Swal.fire({
             title: "Are you sure?",
             text: "You won't be able to revert this!",
             icon: "warning",
             showCancelButton: true,
             confirmButtonColor: "#3085d6",
             cancelButtonColor: "#d33",
             confirmButtonText: "Yes, delete it!"
           })
           if(getconfirmed.isConfirmed){
             let res= await makeapicall("DELETE",REMOVE_URL); 
             ele.closest(".card").parentElement.remove()
             sweetalert("POST IS REMOVED SUCCESSFULLYY!!!","success"); 
           }
        }
       catch(err){
          sweetalert(err,"error")
          }
}

postform.addEventListener("submit",onpostadd)
updatebtn.addEventListener("click",onpostupdate)



