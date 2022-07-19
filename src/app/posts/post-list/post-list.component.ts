import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../post.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector:'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit ,OnDestroy{
//  posts=[
//   {title:'first post', content:'This is the first post\'s content'},
//   {title:'Second post', content:'This is the Second post\'s content'},
//   {title:'Third post', content:'This is the Third post\'s content'},

// ]
isLoading= false;
posts: Post[]= Array();
  private postsSub: Subscription = new Subscription;
  totalPosts=0;
  postPerPage=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10];

constructor(public postService: PostService){}
ngOnInit(){
  this.isLoading= true;
     this.postService.getPosts(this.postPerPage, this.currentPage);
  this.postsSub=  this.postService.getPostUpdateListener()
  .subscribe((postData: {posts:Post[],postCount: number})=>{
    this.isLoading= false;
    this.totalPosts=postData.postCount;
     this.posts= postData.posts;
    });
}


onChangePage(pageData:PageEvent){
  this.isLoading= true;
  this.currentPage=pageData.pageIndex + 1;
  this.postPerPage=pageData.pageSize;
  this.postService.getPosts(this.postPerPage,this.currentPage);
}

 onDelete(postId: any){
  this.isLoading= true;
 this.postService.deletePost(postId).subscribe(()=>{
  this.postService.getPosts(this.postPerPage,this.currentPage)
 });

 }
ngOnDestroy() {
    this.postsSub.unsubscribe();
}
}
