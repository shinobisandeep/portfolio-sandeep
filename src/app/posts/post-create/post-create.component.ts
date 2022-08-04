import { Component, OnInit } from "@angular/core";
import { FormGroup,FormControl, Validators, MinLengthValidator, NG_ASYNC_VALIDATORS } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

import { PostService } from "../post.service";
import { isNull } from "@angular/compiler/src/output/output_ast";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
  enteredContent= '';
  enteredTitle='';
  private mode ='create';
  private postId!: string |null  ;
    posts: Post;
   imagePreview: string='';
  form: FormGroup=new FormGroup({});

 isLoading= false;

constructor(public postService: PostService,public route:ActivatedRoute){
 this.posts={id:'',title:'',content:'',image:new File([""], "dummy", {}),imagePath:''};
}
 ngOnInit() {
    this.form =new FormGroup({
      title: new FormControl('',{
    validators:[Validators.required,Validators.minLength(3)]}),
    content: new FormControl('',{validators:[Validators.required,]}),
    image: new FormControl('',{validators:[Validators.required],asyncValidators:[mimeType]})
    });
     this.route.paramMap.subscribe((paramMap: ParamMap)=>{

       if(paramMap.has('postId')){
          this.mode= 'edit';
          this.postId= paramMap.get('postId');
          this.isLoading=true;
          this.postService.getPost(this.postId).subscribe(postData=>{
          this.isLoading=false;
            this.posts={
              id:postData._id,
              title:postData.title,
              content:postData.content,
              image: postData.image,
              imagePath: postData.imagePath
            };
            this.form.setValue(
              {title:this.posts.title,content:this.posts.content,image:this.posts.imagePath});
          });


       } else{
         this.mode='create';
         this.postId= null;
       }
     });
 }

 onImagePicked(event:Event){

    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader= new FileReader();
    reader.onload=()=>{
      this.imagePreview= reader.result as string;
    };
    reader.readAsDataURL(file);

 }


  OnSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create')
    {
      this.postService.addPost(
      this.form.value.title,this.form.value.content,this.form.value.image);
    }
      else{


        this.postService.updatePost(this.postId,this.form.value.title
          ,this.form.value.content,
          this.form.value.image,this.form.value.image);
      }
   this.form.reset();
  }
}
