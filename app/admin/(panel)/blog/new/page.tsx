import type { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Blog</p>
          <h1 className={shared.pageTitle}>New Post</h1>
        </div>
      </div>
      <PostForm />
    </div>
  );
}
