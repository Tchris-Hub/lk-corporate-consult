import { requireAdmin } from "@/lib/auth";
import { ArticleEditor } from "@/app/admin/posts/editor";
export default async function NewPost() { await requireAdmin(); return <ArticleEditor />; }
