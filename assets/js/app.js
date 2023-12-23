const cl= console.log;

const commentForm =document.getElementById("commentForm");
const titlecontrol= document.getElementById("title");
const bodycontrol = document.getElementById("body");
const submitBtn = document.getElementById("submitBtn");
const updatBtn = document.getElementById("updatBtn")
const commentcard =document.getElementById("commentcard");

const baseUrl =`https://postmat-e75c9-default-rtdb.asia-southeast1.firebasedatabase.app`
const commentUrl =`${baseUrl}/post.json`



const templating=(arr)=>{
    let result = [];
  arr.forEach(ele => {
      result+= ` <div class="card " id="${ele.userId}" >
    <div class="card-header">${ele.title}</div>
    <div class="card-body">${ele.body}</div>
    <div class="card-footer d-flex justify-content-between">
    <button class="btn btn-primary" onclick= "onEdit(this)">Edit</button>
    <button class="btn btn-danger " type="button" onclick= "onDelete(this)" >Delete</button>
    </div>
  </div>
</div>`
  });
  commentcard.innerHTML = result;
}

const objIntoArray =(obj,id)=>{
    let arr = [];
    for (const key in obj) {
         let updatedObj = obj[key];
         updatedObj[id] = key
       arr.push(updatedObj)
      }
      return arr
    }
const makeApiCall =(methodName, apiUrl, body=null)=>{
let promise = new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest()
        xhr.open (methodName,apiUrl)
        xhr.onload=()=>{
            if(xhr.status >=200 && xhr.status < 300){
                resolve(xhr.response)
            }else{
                reject(xhr.response)
            }
        }
        xhr.send(body)
        
       
 })
  return promise

}

 const getAlldata=()=>{
    makeApiCall("GET", commentUrl )
    .then(res=>{
       let data = JSON.parse(res)
       let arr = objIntoArray(data,"userId")
       templating(arr)
    
    })
    .catch(err=>{
        cl(err)
    })
 }

 getAlldata()

onformSubmit=(eve)=>{
   eve.preventDefault();
   let postObj = {
     title : titlecontrol.value,
     body : bodycontrol.value
   }
   makeApiCall("POST", commentUrl, JSON.stringify(postObj))
   .then(res=>{
        let resdata = JSON.parse(res);
        cl(resdata)
        let card = document.createElement("div")
        card.className = "card"
        card.id = resdata.id
        card.innerHTML = `<div class="card-header">${postObj.title}</div>
        <div class="card-body">${postObj.body}</div>
        <div class="card-footer d-flex justify-content-between">
        <button class="btn btn-primary" >Edit</button>
        <button class="btn btn-danger " type="button" >Delete</button>
        </div>
      </div>`
   commentcard.append(card);

   })
   .catch(err=>{
    cl(err)
   })
   .finally( ()=>{
       commentForm.reset()
   })
}






onEdit=(ele)=>{
    let editId= ele.closest(".card").id
     localStorage.setItem("editId", editId);
     let editUrl = `${baseUrl}/post/${editId}.json`
      makeApiCall ("GET", editUrl)
     
      .then(res=>{
        updatBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none")
        let resData = JSON.parse(res)
        titlecontrol.value = resData.title
        bodycontrol.value = resData.body
      })
      .catch(err=>cl(err))


}

 OnUpdate=(obj)=>{
  let updateId = localStorage.getItem("editId");
  let updateObj = {
    title : titlecontrol.value,
    body : bodycontrol.value
  }
  let updateUrl = ` ${baseUrl}/post/${updateId}.json`
  makeApiCall("PATCH",updateUrl, JSON.stringify(updateObj))
  .then(res=>{
      let data = JSON.parse(res);
      let card ={
        ...document.getElementById(updateId).children
          }
          card[0].innerHTML = `${updateObj.title}`
          card[1].innerHTML = `${updateObj.body}`  
  })
  .catch(err=>{cl(err)})
}

onDelete=(obj)=>{
     let DeleteId = obj.closest(".card").id;
     let deleteUrl = `${baseUrl}/post/${DeleteId}.json`
     makeApiCall("DELETE",deleteUrl)
     .then(res=>{
        document.getElementById(DeleteId).remove(res)
     })
     .catch(err=>{
        cl(err)
     })
}

commentForm.addEventListener("submit", onformSubmit)
updatBtn.addEventListener("click",OnUpdate)
